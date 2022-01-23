import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'
import { minifyHtml } from 'vite-plugin-html'
import fs from 'fs'

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
    svelte(),
    visualizer(),
    minifyHtml(),
  ],
  base: BASE,
  build: {
    minify: 'terser',
    target: 'esnext',
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

        ecma: 2020,
        passes: 2,
      },
    },
    /*rollupOptions: {
      input: {
        wetter: 'src/logic/weather.ts',
      },
      output: {
        entryFileNames: '[name].js',
        format: 'iife',
        exports: 'named',
        dir: 'dist',
      },
    },*/
  },
  server: {
    open: false,
    https: {
      key: fs.readFileSync('localhost-key.pem'),
      cert: fs.readFileSync('localhost.pem'),
    },
  },
})
