<script lang="ts">
  import CurrentWeather from './components/CurrentWeather.svelte'
  import DayWeather from './components/DayWeather.svelte'
  import Location from './components/Location.svelte'
  // import { getSunriseSunset } from './logic/time'

  // let sunTimes = getSunriseSunset(new Date('2021-05-03T12:00Z'), 48.14, 11.58)
</script>

<main
  class="max-w-md m-auto mt-2 grid grid-cols-1 gap-2"
>
  <div class="shadow-md rounded-md p-2 bg-white"><Location /></div>
  <div class="shadow-md rounded-md p-2 bg-white"><CurrentWeather /></div>
  <div><DayWeather /></div>
</main>
<footer class="bg-gray-200 p-3 mt-5 text-sm text-center text-gray-500">
  Quelle: <a class="no-underline text-gray-800" href="https://www.dwd.de"
    >Deutscher Wetterdienst</a
  ><br />
  via
  <a class="no-underline text-gray-800" href="https://brightsky.dev"
    >brightsky.dev</a
  >
</footer>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    @apply bg-cool-gray-200;
    @apply text-gray-700;
    height: 100%;
    margin: 0;
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
  }
</style>
