<script lang="ts">
  import WeatherIcon from './icons/WeatherIcon.svelte'
  import WindDirection from './icons/WindDirection.svelte'
  import { currentWeatherData } from '../stores/store'
  import { humidity } from './icons/icons'
  import SvgIcon from './icons/SvgIcon.svelte'
  import UnitXperY from './common/UnitXperY.svelte'
  import type { WeatherDataType } from '../logic/weatherTypes'

  function toLocalDecimal(num, precision = 0) {
    return Number.parseFloat(num).toFixed(precision).toLocaleString()
  }

  const ANIMATION_DURATION = 150
  const MIN_PRECIPITATION = 0.3
  const SHOW_WINDSPEED_WARNING_AFTER = 25
  let weather: WeatherDataType
  $: weather = $currentWeatherData
</script>

<div
  class="flex space-x-1 h-32 mx-0.5 relative tabular-nums select-none children:(shadow-md rounded-md bg-white w-32 h-32 relative) children:dark:bg-dark-600"
>
  <div>
    {#if weather && weather.timestamp}
      <WindDirection
        class="h-8 -m-4 inset-1/2 w-8 z-10 absolute"
        direction={weather.windDirection}
        strength={weather.windSpeed}
      />

      <div class="bottom-info children:(flex space-x-1)">
        <div class:!hidden={weather.precipitation < MIN_PRECIPITATION}>
          {toLocalDecimal(
            weather.precipitation,
            weather.precipitation % 1 === weather.precipitation ? 0 : 1
          )}
          <UnitXperY top="mm" bottom="h" />
        </div>

        <div>
          <div
            class:current-warning-text={weather.windSpeed >
              SHOW_WINDSPEED_WARNING_AFTER}
          >
            {toLocalDecimal(weather.windSpeed)}
          </div>
          <UnitXperY top="km" bottom="h" />
        </div>
      </div>
    {/if}
  </div>
  <div>
    {#if weather && weather.timestamp}
      <WeatherIcon class="m-2 pt-1 inset-0 absolute" icon={weather.icon} />
    {/if}
  </div>
  <div class="flex p-2 box-border justify-center">
    {#if weather && weather.timestamp}
      <div class="flex font-light h-full mt-3 text-right ml-1 text-7xl">
        <span
          class="max-w-4 overflow-hidden"
          class:hidden={weather.temperature >= 0}>-</span
        >{Math.abs(weather.temperature)}
        <span class="mt-1 text-base">°</span>
      </div>

      <div class="bottom-info children:(flex space-x-1)">
        <div>
          <SvgIcon class="h-5 w-5 push-down" d={humidity} outline />
          {weather.relativeHumidity}
          <span class="ml-0.5 text-size-[0.6rem] self-center">%</span>
        </div>
      </div>
    {/if}
  </div>
</div>

<style global>
  .current-warning-text {
    @apply font-semibold text-orange-600;
  }
  .bottom-info {
    @apply flex space-x-2 w-full bottom-2 z-10 absolute justify-around;
  }
  .push-down {
    transform: translate(-2px, 2px);
  }
</style>
