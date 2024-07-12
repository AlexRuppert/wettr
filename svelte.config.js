import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [vitePreprocess()],
  onwarn: (warning, handler) => {
    if (warning.code.startsWith('a11y-')) return
    if (warning.code.startsWith('a11y_click_events_have_key_events')) return
    if (warning.code.startsWith('css_unused_selector')) return
    console.log(warning.code)
    handler(warning)
  },
}

export default config
