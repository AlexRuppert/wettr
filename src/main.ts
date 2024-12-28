import { mount } from 'svelte'
import App from './App.svelte'
//@ts-ignore
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onOfflineReady() {
    // show a ready to work offline to user
  },
})

const app = mount(App, { target: document.body.firstChild as Element })
export default app
