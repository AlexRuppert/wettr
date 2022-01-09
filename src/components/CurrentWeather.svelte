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
    <div class="relative">
      <MiniRadar />
      <div class="h-7 -mt-3 text-shadow-xs -ml-3 top-1/2 left-1/2 w-7 z-10 absolute pointer-events-none">
        <div class="h-full -mt-[0.30rem] w-full ">
          <WindDirection direction={weather.windDirection} />
        </div>
      </div>
      <div class="right-1 bottom-2 absolute">
        {toLocalDecimal(weather.windSpeed)}
        <span class="text-xs text-size-[0.5rem]"
          ><sup>km</sup>/<sub>h</sub></span
        >
      </div>

      {#if weather.precipitation > 0.5}
        <div class="flex bottom-2 left-1 absolute" transition:fade>
          <div class="h-4 mr-1 w-4 self-center">
            <SvgIcon d={umbrellaOpen} />
          </div>
          <span>
            {toLocalDecimal(
              weather.precipitation,
              weather.precipitation % 1 === weather.precipitation ? 0 : 1
            )}<span class="pl-1 text-size-[0.5rem]"
              ><sup>mm</sup>/<sub>h</sub></span
            >
          </span>
        </div>
      {/if}
    </div>
    <div class="p-2 relative">
      <WeatherIcon
        icon={weather.icon}
        color={getDarkLightColor(getWeatherIconColors(weather.icon), $darkMode)}
      />
    </div>
    <div class="flex p-2 relative justify-end children:self-center">
      <div class="font-light text-right mb-2 text-7xl">
        {weather.temperature}
      </div>
      <div class="-mt-8 text-3xl">°</div>
      <div class="flex right-2 bottom-2 absolute">
        <span class="h-4 self-center">
          <SvgIcon d={humidity} />
        </span>
        <span>
          {weather.relativeHumidity}
        </span>
        <span class="text-xs pl-1 self-center">%</span>
      </div>
    </div>
  </div>
</div>
