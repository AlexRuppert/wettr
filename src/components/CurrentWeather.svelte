<script lang="ts">
  import WeatherIcon from './icons/WeatherIcon.svelte'
  import WindDirection from './icons/WindDirection.svelte'
  import { umbrellaClosed, umbrellaOpen } from './icons/icons'
  import SvgIcon from './icons/SvgIcon.svelte'
  import { currentWeatherData } from '../stores/store'

  function toLocalDecimal(num, precision = 0) {
    return Number.parseFloat(num).toFixed(precision).toLocaleString()
  }

  let weather
  $: weather = $currentWeatherData
</script>

<div
  class="flex flex-nowrap tabular-nums"
  class:opacity-0={Object.keys(weather).length <= 0}
>
  <div class="w-30 h-30">
    <WeatherIcon icon={weather.icon} />
  </div>

  <div class="flex text-center justify-center space-x-1 flex-1">
    {#if weather.precipitation > -10}
      <div class="flex flex-col justify-center items-center w-1/2">
        <div class="w-7 h-7">
          <SvgIcon
            d={weather.precipitation > 2.5 ? umbrellaOpen : umbrellaClosed}
          />
        </div>
        <span class="text-xl">
          {toLocalDecimal(
            weather.precipitation,
            weather.precipitation % 1 === weather.precipitation ? 0 : 1
          )}
        </span>
        <span class="text-xs">mm/h</span>
      </div>
    {/if}
    <div class="flex flex-col justify-center items-center">
      <div class="w-8 h-7 -mt-1 pb-1">
        <WindDirection direction={weather.windDirection} />
      </div>
      <span class="text-xl">
        {toLocalDecimal(weather.windSpeed)}
      </span>
      <span class="w-10 text-xs">km/h</span>
    </div>
  </div>
  <div class="flex">
    <div class="w-30 font-extralight text-7xl text-right self-center">
      {weather.temperature}
    </div>
    <div class="-mt-7 text-3xl self-center">°</div>
  </div>
</div>
