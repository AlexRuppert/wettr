<script lang="ts">
  import WeatherIcon from './icons/WeatherIcon.svelte'
  import WindDirection from './icons/WindDirection.svelte'
  import MiniRadar from './radar/MiniRadar.svelte'
  import { currentWeatherData, darkMode } from '../stores/store'
  import { fade } from 'svelte/transition'
  import { getDarkLightColor, getWeatherIconColors } from '../logic/utils'
  import { humidity, umbrellaOpen } from './icons/icons'
  import SvgIcon from './icons/SvgIcon.svelte'

  function toLocalDecimal(num, precision = 0) {
    return Number.parseFloat(num).toFixed(precision).toLocaleString()
  }

  let weather
  $: weather = $currentWeatherData
</script>

<div class="" class:opacity-0={Object.keys(weather ?? {}).length <= 0}>
  <div
    class="mx-1 grid transition-opacity ease-in-out gap-1 grid-cols-3 duration-700 relative tabular-nums children:(shadow-md rounded-md bg-white) children:dark:bg-dark-600 "
  >
    <div class="">
      <MiniRadar />
    </div>
    <div class="p-2 relative">
      <WeatherIcon
        icon={weather.icon}
        color={getDarkLightColor(getWeatherIconColors(weather.icon), $darkMode)}
      />
    </div>
    <div class="flex p-2 justify-end children:self-center">
      <div class="font-light text-right mb-2 text-7xl">
        {weather.temperature}
      </div>
      <div class="-mt-8 text-3xl">°</div>
    </div>
  </div>
  <div
    class="bg-white rounded-md h-14 shadow-md mx-1 mt-1 grid gap-1 grid-cols-3 dark:bg-dark-600 children:(flex items-center justify-center h-full space-x-1) "
  >
    <div>
      <div class="h-6 -mr-1 w-6">
        <WindDirection direction={weather.windDirection} />
      </div>
      <span class="text-lg">
        {toLocalDecimal(weather.windSpeed)}
        <span class="text-xs">km/h</span>
      </span>
    </div>
    <div>
      {#if weather.percipation > 0.5}
        <div class="h-5 w-5" transition:fade>
          <SvgIcon d={umbrellaOpen} />
        </div>
        <span transition:fade>
          {toLocalDecimal(
            weather.precipitation,
            weather.precipitation % 1 === weather.precipitation ? 0 : 1
          )}<span class="text-xs pl-1">mm/h</span>
        </span>
      {/if}
    </div>
    <div>
      <div class="h-5 w-5">
        <SvgIcon d={humidity} />
      </div>
      <span>
        {weather.relativeHumidity}<span class="text-xs pl-1">%</span>
      </span>
    </div>
  </div>
</div>
