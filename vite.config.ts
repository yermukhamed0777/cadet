import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// mode "hash" — build for static hosting without an SPA fallback
// (HashRouter, relative paths, no service worker).
export default defineConfig(({ mode }) => {
  const isHash = mode === 'hash';
  return {
    base: isHash ? './' : '/',
    define: {
      __ROUTER_MODE__: JSON.stringify(isHash ? 'hash' : 'browser'),
    },
    build: { outDir: isHash ? 'dist-hash' : 'dist' },
    plugins: [
      react(),
      VitePWA({
        disable: isHash,
        registerType: 'autoUpdate',
        includeAssets: ['icons/favicon.svg', 'icons/apple-touch-icon.png'],
        manifest: {
          name: 'CADET — Your path to commission',
          short_name: 'CADET',
          description: 'A source-grounded readiness tracker for U.S. service academy applicants.',
          lang: 'en',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          orientation: 'portrait',
          background_color: '#10243E',
          theme_color: '#10243E',
          icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
            { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          navigateFallback: '/index.html',
          globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        },
      }),
    ],
  };
});
