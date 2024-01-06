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
</script>

<svelte:head>
  <meta name="theme-color" content={darkMode.value ? '#000' : '#fff'} />
</svelte:head>
<SvgLib />
<main class="relative m-auto flex w-full max-w-sm flex-col gap-1 p-1 *:w-full">
  <Location />
  <CurrentWeather />
  <WeatherWarning />
  <DayWeather />
</main>
<Footer />
