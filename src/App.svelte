<script lang="ts">
  import CurrentWeather from './components/CurrentWeather.svelte'
  import DayWeather from './components/DayWeather.svelte'
  import Location from './components/Location.svelte'
</script>

<main class="max-w-sm w-full mt-1 m-auto grid grid-cols-1 gap-1">
  <Location />
  <CurrentWeather />
  <DayWeather />
</main>
<footer class="bg-gray-200 py-10 mt-5 text-sm text-center children:(text-gray-800)">
  Quelle: <a class="no-underline font-medium" href="https://www.dwd.de"
    >Deutscher Wetterdienst</a
  ><br />
  via
  <a class="no-underline font-medium" href="https://brightsky.dev"
    >brightsky.dev</a
  >
</footer>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    @apply bg-cool-gray-200 text-gray-700 overflow-y-scroll;

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
