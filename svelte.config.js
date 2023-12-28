import { windi } from 'svelte-windicss-preprocess'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    windi({ configPath: 'windi.config.mjs', siltent: true }),
    vitePreprocess(),
  ],
  onwarn: (warning, handler) => {
    if (warning.code.startsWith('a11y-')) return
    handler(warning)
  },
}

export default config
