const windicss = require('svelte-windicss-preprocess').windi
const sveltePreprocess = require('svelte-preprocess')

module.exports = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    windicss({ configPath: 'windi.config.mjs', silent: false }),
    sveltePreprocess(),
  ],
}
