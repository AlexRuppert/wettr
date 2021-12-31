<script lang="ts">
  import WeatherIcon from './icons/WeatherIcon.svelte'
  import WindDirection from './icons/WindDirection.svelte'
  import MiniRadar from './radar/MiniRadar.svelte'
  import { currentWeatherData, darkMode } from '../stores/store'
  import { fade } from 'svelte/transition'
  import {
    getDarkLightColor,
    getForegroundColor,
    getWeatherIconColors,
  } from '../logic/utils'
  import { humidity, umbrellaOpen } from './icons/icons'
  import SvgIcon from './icons/SvgIcon.svelte'

  function toLocalDecimal(num, precision = 0) {
    return Number.parseFloat(num).toFixed(precision).toLocaleString()
  }

  let weather
  $: weather = $currentWeatherData
</script>

<div class="space-y-1" class:opacity-0={Object.keys(weather ?? {}).length <= 0}>
  <div
    class="grid grid-cols-3 gap-1 grid-rows-1 relative tabular-nums children:(shadow-md rounded-md bg-white) children:dark:bg-dark-600 transition-opacity ease-in-out duration-700 mx-1"
  >
    <div class="">
      <MiniRadar />
    </div>
    <div class="relative p-2">
      {#if weather.precipitation >= 1}
        <span class="w-30 text-lg -top-1 absolute text- text-center">
          {toLocalDecimal(
            weather.precipitation,
            weather.precipitation % 1 === weather.precipitation ? 0 : 1
          )}<span class="text-xs pl-1">mm/h</span>
        </span>
      {/if}
      <WeatherIcon
        icon={weather.icon}
        color={getDarkLightColor(getWeatherIconColors(weather.icon), $darkMode)}
      />
    </div>
    <div class="flex p-2">
      <div class="w-25 text-[5rem] mb-2 font-light text-right self-center">
        {weather.temperature}
      </div>
      <div class="-mt-7 text-3xl self-center">°</div>
    </div>
  </div>
  <div
    class="shadow-md rounded-md bg-white dark:bg-dark-600 mx-1 h-10 grid grid-cols-3 gap-1 children:(flex items-center justify-center h-full space-x-1)"
  >
    <div>
      <div class="w-6 h-6 -mr-1">
        <WindDirection
          direction={weather.windDirection}
          color={getForegroundColor($darkMode)}
        />
      </div>
      <span class="text-lg">
        {toLocalDecimal(weather.windSpeed)}
        <span class="w-10 text-xs">km/h</span>
      </span>
    </div>
    <div>
      {#if weather.percipation > 0.5}
        <div class="w-5 h-5" transition:fade>
          <SvgIcon d={umbrellaOpen} fill={getForegroundColor($darkMode)} />
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
      <div class="w-5 h-5">
        <SvgIcon d={humidity} fill={getForegroundColor($darkMode)} />
      </div>
      <span>
        {weather.relativeHumidity}<span class="text-xs pl-1">%</span>
      </span>
    </div>
  </div>
</div>
