<script lang="ts">
  import WeatherIcon from './icons/WeatherIcon.svelte'
  import WindDirection from './icons/WindDirection.svelte'
  import { currentWeatherData } from '../stores/store'
  import { fade, scale } from 'svelte/transition'
  import { humidity } from './icons/icons'
  import SvgIcon from './icons/SvgIcon.svelte'
  import type { WeatherDataType } from '../logic/weatherTypes'

  function toLocalDecimal(num, precision = 0) {
    return Number.parseFloat(num).toFixed(precision).toLocaleString()
  }

  const ANIMATION_DURATION = 150
  const MIN_PRECIPITATION = 0.3
  let weather: WeatherDataType
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
        />

        <div class="text-shadow-light pointer-events-none">
          <div class="h-8 -m-4 inset-1/2 w-8 z-10 absolute">
            <WindDirection direction={weather.windDirection} />
          </div>

          <div
            class="flex space-x-2 w-full bottom-2 z-10 absolute justify-around"
          >
            <div
              class="flex space-x-1"
              class:!hidden={weather.precipitation < MIN_PRECIPITATION}
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

            <div
              class="flex space-x-1"
              class:pl-3={weather.precipitation < MIN_PRECIPITATION}
            >
              <div class:current-warning-text={weather.windSpeed > 25}>
                {toLocalDecimal(weather.windSpeed)}
              </div>
              <div class="pt-1 text-size-[0.5rem] self-center">
                <sup>km</sup>/<sub>h</sub>
              </div>
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
    <div class="flex p-2 box-border justify-center dark:bg-dark-600">
      <div
        class="flex font-light h-full mt-3 text-right ml-1 text-7xl"
        transition:fade={{ duration: ANIMATION_DURATION }}
      >
        <span
          class="max-w-4 overflow-hidden"
          class:hidden={weather.temperature >= 0}>-</span
        >{Math.abs(weather.temperature)}
        <span class="mt-1 text-sm">°</span>
      </div>

      <div
        class="flex bottom-2 justify-center absolute"
        transition:scale={{ duration: ANIMATION_DURATION }}
      >
        <div class="h-4 w-4 self-center">
          <SvgIcon d={humidity} outline />
        </div>
        <div>
          {weather.relativeHumidity}
        </div>
        <span class="ml-0.5 text-size-[0.5rem] self-center">%</span>
      </div>
    </div>
  {/if}
</div>

<style global>
  .text-shadow-light {
    text-shadow: 0 0 2px #fff;
  }
  @media (prefers-color-scheme: dark) {
    .text-shadow-light {
      text-shadow: 0 0 2px #111;
    }
  }

  .current-warning-text {
    @apply font-semibold text-orange-600;
  }
</style>
