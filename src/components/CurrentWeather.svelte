<script lang="ts">
  import UnitXperY from '@/components/common/UnitXperY.svelte'
  import SvgIcon from '@/components/icons/SvgIcon.svelte'
  import WeatherIcon from '@/components/icons/WeatherIcon.svelte'
  import WindDirection from '@/components/icons/WindDirection.svelte'
  import { humidity } from '@/components/icons/icons'
  import { type CustomElement } from '@/logic/svelte'
  import { toLocalDecimal } from '@/logic/utils'
  import { type WeatherDataType } from '@/logic/weatherTypes'
  import { currentWeatherData } from '@/stores/store'

  interface Props extends CustomElement {}
  let { ...other } = $props<Props>()

  const MIN_PRECIPITATION = 0.3
  const SHOW_WINDSPEED_WARNING_AFTER = 25
  let weather: WeatherDataType = $derived($currentWeatherData)
</script>

{#if weather && weather.timestamp}
  <div
    class="flex select-none space-x-1 tabular-nums *:relative *:size-32 *:rounded-default *:bg-surface-500 *:shadow-md"
  >
    <div>
      <div class="">
        <WindDirection
          className="absolute left-12 top-12 size-8 "
          direction={weather.windDirection}
          strength={weather.windSpeed}
        />
      </div>

      <div class="center absolute bottom-2 z-10 w-full grow space-x-2">
        <div
          class="center space-x-0.5"
          class:!hidden={weather.precipitation < MIN_PRECIPITATION}
        >
          {toLocalDecimal(
            weather.precipitation,
            weather.precipitation % 1 === weather.precipitation ? 0 : 1,
          )}
          <UnitXperY top="mm" bottom="h" />
        </div>

        <div class="center space-x-0.5">
          <div
            class:current-warning-text={weather.windSpeed >
              SHOW_WINDSPEED_WARNING_AFTER}
          >
            {toLocalDecimal(weather.windSpeed)}
          </div>
          <UnitXperY top="km" bottom="h" />
        </div>
      </div>
    </div>
    <div class="text-text-hard">
      <WeatherIcon className="p-3 pt-4" icon={weather.icon} />
    </div>
    <div class="flex justify-center p-2 pt-5">
      <div class="flex text-7xl font-light">
        <span
          class="max-w-4 overflow-hidden"
          class:hidden={weather.temperature >= 0}>-</span
        >{Math.abs(weather.temperature)}
        <span class="mt-1 text-base">°</span>
      </div>

      <div class="center absolute bottom-2 z-10 w-full space-x-0.5">
        <SvgIcon className="mt-[0.2em] block size-5" d={humidity} outline />
        <div>{weather.relativeHumidity}</div>
        <div class="text-[0.8em]">%</div>
      </div>
    </div>
  </div>
{/if}

<style>
  .current-warning-text {
    @apply font-semibold text-warning;
  }
</style>
