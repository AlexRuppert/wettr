<script lang="ts">
  import WeatherIcon from './icons/WeatherIcon.svelte'
  import WindDirection from './icons/WindDirection.svelte'
  import { umbrellaClosed, umbrellaOpen } from './icons/icons'
  import SvgIcon from './icons/SvgIcon.svelte'
  import { currentWeatherData, darkMode } from '../stores/store'
  import {
    getDarkLightColor,
    getForegroundColor,
    getWeatherIconColors,
  } from '../logic/utils'

  function toLocalDecimal(num, precision = 0) {
    return Number.parseFloat(num).toFixed(precision).toLocaleString()
  }

  let weather
  $: weather = $currentWeatherData
</script>

<div
  class="flex flex-nowrap tabular-nums shadow-md rounded-md p-2 bg-white dark:bg-dark-600 transition-opacity ease-in-out duration-700 mx-1"
  class:opacity-0={Object.keys(weather ?? {}).length <= 0}
>
  <div class="w-30 h-30 relative">
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

  <div class="flex text-center justify-center space-x-1 flex-1">
    <div class="flex flex-col justify-center items-center pl-5">
      <div class="w-8 h-7 -mt-1 pb-1">
        <WindDirection
          direction={weather.windDirection}
          color={getForegroundColor($darkMode)}
        />
      </div>
      <span class="text-xl">
        {toLocalDecimal(weather.windSpeed)}
      </span>
      <span class="w-10 text-xs">km/h</span>
    </div>
  </div>
  <div class="flex">
    <div class="w-30 text-7xl font-light text-right self-center">
      {weather.temperature}
    </div>
    <div class="-mt-7 text-3xl self-center">°</div>
  </div>
</div>
