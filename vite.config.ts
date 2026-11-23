import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// mode "hash" — сборка для статического хостинга без настройки SPA-fallback
// (HashRouter, относительные пути, без service worker).
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
          name: 'BOLASHAQ KURSANT',
          short_name: 'KURSANT',
          description: 'Твой путь в академию — помощник абитуриента вузов МВД РК',
          lang: 'ru',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          orientation: 'portrait',
          background_color: '#071A2F',
          theme_color: '#071A2F',
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
