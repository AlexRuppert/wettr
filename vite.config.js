import { defineConfig } from 'vite'
import svelte from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'
const BASE = '/wettr/'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VitePWA({
      base: BASE,
      registerType: 'autoUpdate',
      manifest: {
        name: 'Wettr',
        short_name: 'Wettr',
        icons: [
          {
            src: BASE + 'favicon/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: BASE + 'favicon/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        lang: 'de',
        scope: BASE,
        start_url: BASE,
      },
      workbox: {
        sourcemap: false,
      },
    }),
    svelte(),
  ],
  base: BASE,
})