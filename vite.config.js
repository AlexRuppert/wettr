import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'
import { minifyHtml } from 'vite-plugin-html'
import cssnano from 'cssnano'
import postcss from 'postcss'
import fs from 'fs'

const BASE = '/wettr/'
// https://vitejs.dev/config/

function postPostCSS() {
  function removeGlobal(css) {
    return css.replace(/:global\(([^\(]+)\)/g, '$1')
  }
  function minifyCSSVariables(css) {
    const varList = new Set(css.match(/--[-\w\d]+/g))
    const usedVarList = new Set(css.match(/--[-\w\d]+(?=:)/g))

    let i = 0
    varList.forEach(variable => {
      if (!usedVarList.has(variable)) {
        css = css.replaceAll(variable, '""')
        css = css.replaceAll('var("")', '')
        css = css.replaceAll(/var\("",([^\)]+)\)/g, '$1')
        css = css.replaceAll(/--[-\w\d]+:\s;/g, '')
      } else {
        css = css.replaceAll(variable, '--e' + i++)
      }
    })

    return css
  }
  function minifyDark(css) {
    const regex =
      /@media \(prefers-color-scheme: dark\)\{(([^\}]|\}(?!\}))*\})\}/g
    let temp = ''
    while ((result = regex.exec(css))) {
      temp += result[1]
    }
    return (
      css.replaceAll(regex, '') + `@media (prefers-color-scheme:dark){${temp}}`
    )
  }
  function simplify(css) {
    const regexes = [
      { regex: /transparent(?=;|\})/g, replace: '#00000000' },
      //{ regex: /dark\\:/g, replace: '' },
      { regex: /background-color/g, replace: 'background' },
    ]
    regexes.forEach(r => (css = css.replaceAll(r.regex, r.replace)))
    return css
  }

  return {
    name: 'postPostCSS',
    generateBundle(options, bundle) {
      const cssFiles = Object.keys(bundle)
        .filter(key => key.endsWith('.css'))
        .map(key => bundle[key])

      cssFiles.forEach(css => {
        let cssCode = removeGlobal(css.source)
        for (let i = 0; i <= 3; i++) {
          cssCode = minifyCSSVariables(cssCode)
        }

        cssCode = minifyDark(cssCode)
        cssCode = simplify(cssCode)
        postcss([
          cssnano({
            preset: 'advanced',
          }),
        ])
          .process(cssCode)
          .then(result => {
            css.source = result.css
          })
      })
    },
  }
}

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
    /* modify({
      find: /:global\(([^\(]+)\)/g,
      replace: (match, path) => path,
    }),*/

    svelte(),

    visualizer(),
    minifyHtml(),
    postPostCSS(),
  ],

  /*css: {
    postcss: {
     
      plugins: [cssnano],
    },
  },*/
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
