<script lang="ts">
  import './app.css'

  import CurrentWeather from './components/CurrentWeather.svelte'
  import Location from './components/Location.svelte'

  import SvgLib from './components/common/SvgLib.svelte'
  import Footer from './components/Footer.svelte'
  import WeatherWarning from './components/warnings/WeatherWarning.svelte'
  import './logic/colorScheme'
  import Days from './components/Days.svelte'

  async function init() {
    try {
      //@ts-ignore
      await screen?.orientation?.lock('portrait')
    } catch (ex) {}
    if (window.navigator['standalone']) {
      //skip if not in PWA mode
    }
  }
  init()
</script>

<SvgLib />
<main
  class="relative m-auto flex w-full max-w-sm flex-col gap-1 px-0.5 py-1 *:w-full"
>
  <Location />
  <CurrentWeather />
  <WeatherWarning />
  <Days />
</main>
<Footer />
