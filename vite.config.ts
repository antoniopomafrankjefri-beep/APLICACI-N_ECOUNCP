import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png', 'pwa-maskable-512x512.png', 'logos/uncp-logo.jpg', 'logos/fiq-logo.png'],
        manifest: {
          id: '/',
          name: 'EcoUNCP - Segregación y Puntos de Acopio UNCP',
          short_name: 'EcoUNCP',
          description: 'Aplicación oficial UNCP para segregación de residuos y mapa de puntos de acopio en campus Huancayo. Norma NTP 900.058:2019.',
          theme_color: '#006000',
          background_color: '#FFFFFF',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          orientation: 'portrait-primary',
          lang: 'es',
          categories: ['education', 'utilities', 'lifestyle'],
          icons: [
            {
              src: '/logos/ecouncp/ecouncp-logo-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/logos/ecouncp/ecouncp-logo-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/logos/ecouncp/ecouncp-logo-maskable-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/logos/ecouncp/apple-touch-icon.png',
              sizes: '180x180',
              type: 'image/png',
              purpose: 'any',
            },
          ],
          shortcuts: [
            {
              name: 'Clasificador',
              short_name: 'Clasificar',
              description: 'Buscar residuo y ver su contenedor',
              url: '/',
              icons: [{ src: '/logos/ecouncp/ecouncp-logo-192.png', sizes: '192x192' }],
            },
            {
              name: 'Mapa de Puntos',
              short_name: 'Mapa',
              description: 'Ver estaciones de acopio cercanas',
              url: '/?tab=map',
              icons: [{ src: '/logos/ecouncp/ecouncp-logo-192.png', sizes: '192x192' }],
            },
            {
              name: 'Quiz Ambiental',
              short_name: 'Quiz',
              description: 'Pon a prueba tus conocimientos',
              url: '/?tab=education',
              icons: [{ src: '/logos/ecouncp/ecouncp-logo-192.png', sizes: '192x192' }],
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,json,jpg}'],
          runtimeCaching: [
            {
              // OpenStreetMap tiles caching
              urlPattern: /^https:\/\/[a-c]\.tile\.openstreetmap\.org\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'osm-tiles-cache',
                expiration: {
                  maxEntries: 500,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
