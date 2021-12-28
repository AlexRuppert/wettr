import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'
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
        theme_color: '#000',
        background_color: '#000',
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
    visualizer(),
  ],
  base: BASE,
  build: {
    terserOptions: {
      compress: {
        keep_fargs: false,
        pure_getters: true,
        toplevel: true,
        unsafe_arrows: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_undefined: true,
      },
      ecma: 2016,
    },
  },
})
