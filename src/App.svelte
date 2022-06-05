<script lang="ts">
  import AppInstall from './components/AppInstall.svelte'

  import CurrentWeather from './components/CurrentWeather.svelte'
  import DayWeather from './components/DayWeather.svelte'
  import Location from './components/Location.svelte'
  import Radar from './components/radar/Radar.svelte'
  import WeatherWarning from './components/warnings/WeatherWarning.svelte'
  import { darkMode } from './stores/store'
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
  const links = [
    {
      label: 'Code',
      name: 'GitHub',
      href: '"https://github.com/AlexRuppert/wettr',
    },
    {
      label: 'Datenquelle',
      name: 'Deutscher Wetterdienst',
      href: 'https://www.dwd.de',
    },
    { label: 'via', name: 'brightsky.dev', href: '"https://brightsky.dev' },
  ]
</script>

<svelte:head>
  <meta name="theme-color" content={$darkMode ? '#000' : '#fff'} />
</svelte:head>

<main class="m-auto max-w-sm mt-0 w-full grid gap-1 grid-cols-1 relative">
  <Location />
  <CurrentWeather />
  <WeatherWarning />
  <DayWeather />
  <Radar />
</main>
<footer
  class="space-y-2 bg-gray-200 mt-5 text-sm text-center py-10 dark:bg-dark-800 children:block"
>
  <span class="self-center">
    <AppInstall />
  </span>

  {#each links as { label, name, href }}
    <span>
      {label}
      <a
        {href}
        class="text-gray-800 no-underline dark:text-gray-300 hover:underline"
        target="_blank"
        rel="noopener noreferrer">{name}</a
      >
    </span>
  {/each}
</footer>

<style global>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    @apply bg-cool-gray-200 text-gray-800;
    height: 100%;
    margin: 0;
  }
  html.dark {
    @apply bg-dark-900 text-gray-400;
  }

  body {
    margin: 0;
  }
  #app {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-x: hidden;
  }

  .clickable {
    @apply cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-dark-400 dark:active:bg-dark-800;
  }

  .custom-scrollbar,
  body {
    @apply scrollbar scrollbar-thumb-gray-400 scrollbar-track-light-900 dark:(scrollbar-thumb-dark-50 scrollbar-track-dark-300);
  }
</style>
