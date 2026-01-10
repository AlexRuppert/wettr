import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

const config = {
  preprocess: [vitePreprocess()],
  compilerOptions: {
    runes: true,
  },
  onwarn: (warning, handler) => {
    if (warning.code.startsWith('a11y-')) return
    if (warning.code.startsWith('a11y_click_events_have_key_events')) return
    if (warning.code.startsWith('css_unused_selector')) return
    console.log(warning.code)
    handler(warning)
  },
}

export default config
