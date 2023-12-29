import { createRoot } from 'svelte'
import App from './App.svelte'
//@ts-ignore
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onOfflineReady() {
    // show a ready to work offline to user
  },
})
//@ts-ignore
const app = createRoot(App, { target: document.getElementById('app') })

export default app
