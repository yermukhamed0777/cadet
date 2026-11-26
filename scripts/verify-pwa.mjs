/* global document */
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const failures = [];
const check = (ok, label) => {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${label}`);
  if (!ok) failures.push(label);
};

async function startPreview(outDir, port) {
  const proc = spawn(
    process.execPath,
    [
      './node_modules/vite/bin/vite.js',
      'preview',
      '--host',
      '127.0.0.1',
      '--port',
      String(port),
      '--strictPort',
      '--outDir',
      outDir,
    ],
    { stdio: 'ignore' },
  );
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(base + '/');
      if (r.ok) return { proc, base };
    } catch {
      /* not listening yet */
    }
    await sleep(250);
  }
  throw new Error(`preview server for ${outDir} did not start`);
}

async function probe(label, base, variant) {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox'],
  });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const bad = [];
  page.on('response', (r) => {
    if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`);
  });

  await page.goto(base + '/', { waitUntil: 'load' });
  await page.waitForTimeout(1800);
  check(!bad.length, `${label}: all first-load assets resolve (${bad.length} HTTP errors)`);

  const cryptoResult = await page.evaluate(async () => {
    if (!globalThis.crypto?.subtle) return { ok: false };
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode('probe'),
      'PBKDF2',
      false,
      ['deriveBits'],
    );
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt: new Uint8Array(16), iterations: 1000, hash: 'SHA-256' },
      key,
      128,
    );
    return { ok: true, bytes: bits.byteLength };
  });
  check(cryptoResult.ok && cryptoResult.bytes === 16, `${label}: Web Crypto PBKDF2 works (${cryptoResult.bytes ?? 0} bytes)`);

  const sw = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return { supported: false };
    const reg = await navigator.serviceWorker.getRegistration();
    return { supported: true, registered: Boolean(reg), active: reg?.active?.state ?? null };
  });
  if (variant === 'root') {
    check(sw.registered && sw.active === 'activated', `${label}: service worker active (${sw.active ?? 'none'})`);
  } else {
    check(!sw.registered, `${label}: no service worker in the hash build (expected)`);
  }

  // A hash-only change is a same-document navigation and returns no Response,
  // so force a document request while keeping the hash route under test.
  const direct = await page.goto(
    base + (variant === 'root' ? '/home' : '/?direct=1#/home'),
    { waitUntil: 'load' },
  );
  await page.waitForTimeout(700);
  const url = page.url();
  check(
    variant === 'root' ? url.includes('/login') : url.includes('#/login'),
    `${label}: direct route ${variant === 'root' ? '/home' : '/#/home'} redirects to sign-in (${url})`,
  );
  check(direct?.status() === 200, `${label}: direct route serves HTTP 200`);

  await context.setOffline(true);
  let offlineOk = false;
  let offlineError = '';
  try {
    await page.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 8000 });
    offlineOk = (await page.locator('body').innerText()).length > 0;
  } catch (e) {
    offlineError = e.message.split('\n')[0];
  }
  await context.setOffline(false);
  if (variant === 'root') {
    check(offlineOk, `${label}: offline navigation works from the service-worker cache${offlineError ? ` (${offlineError})` : ''}`);
  } else {
    check(!offlineOk, `${label}: offline navigation unavailable without a service worker (expected)`);
  }

  const manifest = await page.evaluate(() => ({
    link: Boolean(document.querySelector('link[rel="manifest"]')),
    title: document.title,
  }));
  check(variant === 'root' ? manifest.link : true, `${label}: manifest link ${manifest.link ? 'present' : 'absent'} (${variant} expectation)`);

  let installErrors = 'not available';
  try {
    const cdp = await context.newCDPSession(page);
    await cdp.send('Page.enable');
    const result = await cdp.send('Page.getInstallabilityErrors');
    installErrors = JSON.stringify(result.errors || []);
  } catch {
    installErrors = 'CDP check unavailable';
  }
  console.log(
    `INFO ${label}: installability errors ${installErrors}; installable-by-configuration ${variant === 'root' ? manifest.link && sw.registered : false}`,
  );
  await browser.close();
}

const root = await startPreview('dist', 4184);
const hash = await startPreview('dist-hash', 4185);
try {
  await probe('root PWA', root.base, 'root');
  await probe('hash Pages build', hash.base, 'hash');
} finally {
  root.proc.kill();
  hash.proc.kill();
}

if (failures.length) {
  console.error(`\n${failures.length} PWA verification failure(s):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log('\nAll PWA deployment checks passed.');
