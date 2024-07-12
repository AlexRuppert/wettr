import { mount } from 'svelte'
import App from './App.svelte'
//@ts-ignore
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onOfflineReady() {
    // show a ready to work offline to user
  },
})
//@ts-ignore
const app = mount(App, { target: document.getElementById('app') })

export default app
