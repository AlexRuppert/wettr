<script lang="ts">
  import Popup from '@/components/common/Popup.svelte'
  import UnitXperY from '@/components/common/UnitXperY.svelte'
  import SvgIcon from '@/components/icons/SvgIcon.svelte'
  import WeatherIcon from '@/components/icons/WeatherIcon.svelte'
  import WindDirection from '@/components/icons/WindDirection.svelte'
  import { humidity } from '@/components/icons/icons'
  import { getLocationData, lookupStateUrlPart } from '@/logic/locations'
  import { type CustomElement } from '@/logic/svelte.svelte'
  import { toLocalDecimal } from '@/logic/utils'
  import { type CurrentWeatherDataType } from '@/logic/weatherTypes'
  import {
    currentWeatherData,
    locationCoordinates,
    locationState,
  } from '@/stores/store.svelte'

  interface Props extends CustomElement {}
  let { ...other } = $props<Props>()

  let radarFilmPopupOpened = $state(false)
  const MIN_PRECIPITATION = 0.3
  const SHOW_WINDSPEED_WARNING_AFTER = 25
  let weather: CurrentWeatherDataType = $derived(currentWeatherData.value)
  //todo: hacky via warning-meta-data, better use proper location lookup apis
  $effect(() => {
    ;(async () => {
      locationState.value = await getLocationData(locationCoordinates.value)
    })()
  })

  let stateAbbreviation = $derived(locationState.value)
</script>

<Popup bind:opened={radarFilmPopupOpened}
  ><img
    src="https://www.dwd.de/DWD/wetter/radar/radfilm_{lookupStateUrlPart(
      stateAbbreviation,
    )}_akt.gif"
    alt="DWD Radarfilm"
  /></Popup
>
{#if weather && weather.timestamp}
  <div
    class="flex select-none space-x-1 tabular-nums *:relative *:size-32 *:rounded-default *:bg-surface-500 *:shadow-md"
  >
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
        <div>{weather.relative_humidity}</div>
        <div class="text-[0.8em]">%</div>
      </div>
    </div>
    <div class="text-text-hard">
      <WeatherIcon className="p-3 pt-4" icon={weather.icon} />
    </div>
    <div
      onclick={() => (radarFilmPopupOpened = true)}
      role="button"
      tabindex="-1"
      class="clickable"
    >
      <div class="">
        <WindDirection
          className="absolute left-12 top-12 size-8 "
          direction={weather.wind_direction_10}
          strength={weather.wind_speed_10}
        />
      </div>

      <div class="center absolute bottom-2 z-10 w-full grow space-x-2">
        <div
          class="center space-x-0.5"
          class:!hidden={weather.precipitation_60 < MIN_PRECIPITATION}
        >
          {toLocalDecimal(
            weather.precipitation_60,
            weather.precipitation_60 % 1 === weather.precipitation_60 ? 0 : 1,
          )}
          <UnitXperY top="mm" bottom="h" />
        </div>

        <div class="center space-x-0.5">
          <div
            class:current-warning-text={weather.wind_speed_10 >
              SHOW_WINDSPEED_WARNING_AFTER}
          >
            {toLocalDecimal(weather.wind_speed_10 ?? 0)}
          </div>
          <UnitXperY top="km" bottom="h" />
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .current-warning-text {
    @apply font-semibold text-warning;
  }
</style>
