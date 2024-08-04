<script lang="ts">
  import './app.css'

  import CurrentWeather from './components/CurrentWeather.svelte'
  import DayWeather from './components/DayWeather.svelte'
  import Location from './components/Location.svelte'

  import WeatherWarning from './components/warnings/WeatherWarning.svelte'
  import { darkMode } from './stores/store.svelte'
  import './logic/colorScheme'
  import SvgLib from './components/common/SvgLib.svelte'
  import Footer from './components/Footer.svelte'

  function deviceOrientation() {
    const body = document.body

    switch (screen.orientation.type) {
      case 'landscape-primary':
        body.className = 'rotation90'
        break
      case 'landscape-secondary':
        body.className = 'rotation-90'
        break
      default:
        body.className = 'portrait'
        break
    }
  }
  try {
    //@ts-ignore
    screen?.orientation?.lock('portrait')
  } catch (ex) {}
  if (window.navigator['standalone']) {
    //skip if not in PWA mode
    window.addEventListener('orientationchange', deviceOrientation)
    deviceOrientation()
  }
</script>

<svelte:head>
  <meta name="theme-color" content={darkMode.value ? '#000' : '#fff'} />
</svelte:head>
<SvgLib />
<main
  class="relative m-auto flex w-full max-w-sm flex-col gap-1 px-0.5 py-1 *:w-full"
>
  <Location />
  <CurrentWeather />
  <WeatherWarning />
  <DayWeather />
</main>
<Footer />

<style>
  :global(.rotation-90) {
    width: 100vh;
    height: 100vw;
    transform-origin: 0 0;
    transform: rotate(90deg) translateY(-100%);
  }
  :global(body.rotation90) {
    width: 100vh;
    height: 100vw;
    transform-origin: 0 0;
    transform: rotate(-90deg) translateX(-100%);
  }
</style>
