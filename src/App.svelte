<script lang="ts">
  import CurrentWeather from './components/CurrentWeather.svelte'
  import DayWeather from './components/DayWeather.svelte'
  import Location from './components/Location.svelte'
  import { darkMode } from './stores/store'

  let deferredInstallPrompt
  let showInstallButton = false

  let colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: dark)')

  const setColorScheme = e => {
    if (e.matches) {
      // Dark
      document.documentElement.classList.add('dark')
      $darkMode = true
    } else {
      // Light
      document.documentElement.classList.remove('dark')
      $darkMode = false
    }
  }
  setColorScheme(colorSchemeQueryList)
  colorSchemeQueryList.addEventListener('change', setColorScheme)



  window.addEventListener('beforeinstallprompt', e => {
    deferredInstallPrompt = e
    if (
      !(
        window.matchMedia('(display-mode: standalone)').matches ||
        navigator['standalone']
      )
    )
      showInstallButton = true
  })
  window.addEventListener('appinstalled', evt => {
    showInstallButton = false
  })

  const install = async () => {
    deferredInstallPrompt.prompt()
    const choice = deferredInstallPrompt.userChoice
    if (choice.outcome === 'accepted') {
      showInstallButton = true
    }
  }
</script>

<main class="max-w-sm mt-0 w-full m-auto grid grid-cols-1 gap-1">
  <Location />
  <CurrentWeather />
  <DayWeather />
</main>
<footer
  class="bg-gray-200 dark:bg-dark-800 py-10 mt-5 text-sm text-center children:(block)"
>
  Achtung: <br /> Derzeit werden noch keine Wetterwarnungen angezeigt! <br />
  <br />
  <a
    class="inline-block p-2 mb-4 border border-gray-400 dark:bg-dark-300 border-solid rounded-lg"
    class:hidden={!showInstallButton}
    href={'#'}
    on:click={install}>Als App installieren</a
  >

  <span
    >Quelle:
    <a href="https://www.dwd.de">Deutscher Wetterdienst</a></span
  >
  <span
    >via
    <a href="https://brightsky.dev">brightsky.dev</a></span
  >
</footer>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    @apply bg-cool-gray-200 text-gray-700;
    height: 100%;
    margin: 0;
  }
  :global(html.dark) {
    @apply bg-dark-900 text-gray-400;
  }
  footer a {
    @apply no-underline font-medium text-gray-800;
  }
  .dark footer a {
    @apply text-gray-300;
  }
  :global(body) {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    margin: 0;
  }
  :global(#app) {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-x: hidden;
  }
</style>
