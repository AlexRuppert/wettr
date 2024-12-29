import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import { visualizer } from 'rollup-plugin-visualizer'
import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import createHtmlPlugin from 'vite-plugin-simple-html'
import { cssMinify } from './cssMinify'

const BASE = '/wettr/'
// https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    VitePWA({
      base: BASE,
      registerType: 'autoUpdate',
      manifest: {
        name: 'Wettr',
        icons: [
          {
            src: BASE + 'favicon/icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: BASE + 'favicon/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        theme_color: '#000',
        display: 'standalone',
      },
      workbox: {
        sourcemap: false,
      },
    }),
    svelte({}),
    visualizer(),
    createHtmlPlugin({ minify: true }),
    tailwindcss(),
    cssMinify(),
  ],

  base: BASE,
  build: {
    minify: 'terser',
    target: 'esnext',
    cssMinify: 'lightningcss',
    terserOptions: {
      compress: {
        keep_fargs: false,
        pure_getters: true,
        toplevel: true,
        unsafe_arrows: false,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_undefined: true,
        unsafe_regexp: true,
        //

        passes: 2,
      },
    },
  },
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      //targets: browserslistToTargets(browserslist('>= 0.25%')),
    },
  },
  server: {
    open: false,
    https: {
      key: fs.readFileSync('localhost-key.pem'),
      cert: fs.readFileSync('localhost.pem'),
    },
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
    ],
  },
})
