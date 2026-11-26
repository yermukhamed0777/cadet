import { existsSync, readFileSync, statSync } from 'node:fs';

const failures = [];
const check = (ok, label) => {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${label}`);
  if (!ok) failures.push(label);
};
const text = (p) => readFileSync(p, 'utf8');
const size = (p) => `${statSync(p).size} bytes`;

console.log('Verifying deployment artifacts (root build and subpath build)');

for (const file of [
  'dist/index.html',
  'dist/robots.txt',
  'dist/manifest.webmanifest',
  'dist/registerSW.js',
  'dist/sw.js',
  'dist/icons/icon-192.png',
  'dist/icons/icon-512.png',
  'dist/icons/icon-maskable-512.png',
  'dist/icons/apple-touch-icon.png',
  'dist/icons/favicon.svg',
]) {
  check(existsSync(file), `${file} exists (${existsSync(file) ? size(file) : 'missing'})`);
}

const rootHtml = text('dist/index.html');
check(/(?:src|href)="\/assets\//.test(rootHtml), 'root build uses absolute /assets/ paths');
check(rootHtml.includes('registerSW.js'), 'root build registers the service worker');
check(text('dist/robots.txt').includes('Allow: /'), 'robots.txt allows crawling');
check(text('dist/manifest.webmanifest').includes('CADET'), 'manifest names the app CADET');

for (const file of ['dist-hash/index.html', 'dist-hash/robots.txt', 'dist-hash/icons/favicon.svg']) {
  check(existsSync(file), `${file} exists (${existsSync(file) ? size(file) : 'missing'})`);
}

const hashHtml = text('dist-hash/index.html');
check(hashHtml.includes('./assets/') || hashHtml.includes('href="./assets/'), 'hash build uses relative ./assets/ paths');
check(!/(?:src|href)="\/assets\//.test(hashHtml), 'hash build has no absolute asset paths');
check(!existsSync('dist-hash/sw.js'), 'hash build disables the service worker (Pages subpath hosting)');
check(!existsSync('dist-hash/manifest.webmanifest'), 'hash build emits no root-scoped manifest');

if (failures.length) {
  console.error(`\n${failures.length} verification failure(s):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log('\nAll build-artifact checks passed.');
