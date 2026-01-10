<script lang="ts">
  import './app.css'
  import CurrentWeather from './components/CurrentWeather.svelte'
  import Location from './components/Location.svelte'
  import Days from './components/Days.svelte'
  import Footer from './components/Footer.svelte'
  import Lazy from './components/common/Lazy.svelte'
  import { weatherWarningData } from './stores/store.svelte'

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

<main
  class="relative m-auto flex w-full max-w-sm flex-col gap-1 px-0.5 py-1 *:w-full"
>
  <Location />
  <CurrentWeather />
  <Lazy
    loadFn={() => import('./components/warnings/WeatherWarning.svelte')}
    loadIsTriggered={weatherWarningData.value?.length > 0}
  ></Lazy>
  <Days />
</main>
<Footer />
