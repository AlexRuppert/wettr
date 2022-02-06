<script lang="ts">
  import WeatherIcon from './icons/WeatherIcon.svelte'
  import WindDirection from './icons/WindDirection.svelte'
  import MiniRadar from './radar/MiniRadar.svelte'
  import { currentWeatherData, darkMode } from '../stores/store'
  import { fade, scale } from 'svelte/transition'
  import { getDarkLightColor, getWeatherIconColors } from '../logic/utils'
  import { humidity } from './icons/icons'
  import SvgIcon from './icons/SvgIcon.svelte'

  function toLocalDecimal(num, precision = 0) {
    return Number.parseFloat(num).toFixed(precision).toLocaleString()
  }

  const ANIMATION_DURATION = 150
  let weather
  $: weather = $currentWeatherData
</script>

<div
  class="flex space-x-1 h-32 mx-1 relative tabular-nums select-none children:(shadow-md rounded-md bg-white w-32 h-32 relative) "
>
  {#if weather && weather.timestamp}
    <div class="dark:bg-dark-600">
      {#key weather.timestamp}
        <div
          class="inset-0 absolute"
          transition:fade={{ duration: ANIMATION_DURATION }}
        >
          <MiniRadar />
        </div>

        <div
          class="text-shadow-light pointer-events-none children:(z-10 absolute) "
        >
          <div class="h-8 -m-4 inset-1/2 w-8">
            <WindDirection direction={weather.windDirection} />
          </div>

          <div
            class="flex space-x-1 bottom-2 left-2"
            class:!hidden={weather.precipitation < 0.3}
          >
            <div>
              {toLocalDecimal(
                weather.precipitation,
                weather.precipitation % 1 === weather.precipitation ? 0 : 1
              )}
            </div>
            <div class="pt-1 text-size-[0.5rem] self-center">
              <sup>mm</sup>/<sub>h</sub>
            </div>
          </div>

          <div class="flex space-x-1 right-2 bottom-2">
            <div class:current-warning-text={weather.windSpeed > 25}>
              {toLocalDecimal(weather.windSpeed)}
            </div>
            <div class="pt-1 text-size-[0.5rem] self-center">
              <sup>km</sup>/<sub>h</sub>
            </div>
          </div>
        </div>
      {/key}
    </div>
    <div class="dark:bg-dark-600">
      {#key weather.icon}
        <div
          class="m-2 pt-1 inset-0 absolute"
          transition:scale={{ duration: ANIMATION_DURATION }}
        >
          <WeatherIcon icon={weather.icon} />
        </div>
      {/key}
    </div>
    <div class="flex p-2 box-border justify-end dark:bg-dark-600">
      {#key weather.temperature}
        <div
          class="flex font-light h-full mt-3 text-right text-7xl"
          transition:scale={{ duration: ANIMATION_DURATION }}
        >
          <span
            class="max-w-4 overflow-hidden"
            class:hidden={weather.temperature >= 0}>-</span
          >{Math.abs(weather.temperature)}
          <span class="mt-1 text-sm">°</span>
        </div>

        <div
          class="flex right-2 bottom-2 absolute"
          transition:scale={{ duration: ANIMATION_DURATION }}
        >
          <div class="h-4 w-4 self-center">
            <SvgIcon d={humidity} outline />
          </div>
          <div>
            {weather.relativeHumidity}
          </div>
          <span class="text-size-[0.5rem] self-center">%</span>
        </div>
      {/key}
    </div>
  {/if}
</div>

<style global>
  .text-shadow-light {
    text-shadow: 0 0 2px rgba(235, 235, 238, 1);
  }
  @media (prefers-color-scheme: dark) {
    .text-shadow-light {
      text-shadow: 0 0 2px rgba(15, 15, 15, 1);
    }
  }

  .current-warning-text {
    @apply font-semibold text-orange-600;
  }
</style>
