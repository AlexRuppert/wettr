<script lang="ts">
  import Popup from '@/components/common/Popup.svelte'
  import UnitXperY from '@/components/common/UnitXperY.svelte'
  import SvgIcon from '@/components/icons/SvgIcon.svelte'
  import WeatherIcon from '@/components/icons/WeatherIcon.svelte'
  import { humidity, windDirection } from '@/components/icons/icons'
  import { getLocationData } from '@/logic/locations'
  import { type CustomElement } from '@/logic/svelte.svelte'
  import { getWeatherIconClass, toLocalDecimal } from '@/logic/utils'
  import { type CurrentWeatherDataType } from '@/logic/weatherTypes'
  import {
    currentWeatherData,
    locationCoordinates,
    locationState,
  } from '@/stores/store.svelte'
  import { fade } from 'svelte/transition'
  import SvgCorner from './icons/SvgCorner.svelte'
  let lazyRadar = $state(null)
  function loadRadar() {
    lazyRadar = import('./Radar.svelte')
  }

  interface Props extends CustomElement {}
  let { ...other }: Props = $props()

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

  $effect(() => {
    if (radarFilmPopupOpened && !lazyRadar) {
      loadRadar()
    }
  })

  //let stateAbbreviation = $derived(locationState.value)
</script>

<Popup bind:opened={radarFilmPopupOpened}>
  {#if lazyRadar}
    {#await lazyRadar then { default: Radar }}
      <Radar coordinates={locationCoordinates.value} />
    {/await}
  {/if}</Popup
>
<div
  class="flex select-none space-x-1 rounded-default bg-surface-500 tabular-nums *:relative *:rounded-default *:bg-surface-500 *:shadow-md"
>
  {#if weather && weather.timestamp}
    <div
      transition:fade={{ duration: 200 }}
      class="flex h-16 grow items-center justify-center"
      class:rain={getWeatherIconClass(weather.icon) == 'rain'}
      class:sun={getWeatherIconClass(weather.icon) == 'sun'}
    >
      <div class="w-16 shrink-0 text-text-hard">
        <WeatherIcon className="pt-2 pl-2" icon={weather.icon} />
      </div>
      <div
        class="mb-1 flex w-24 shrink-0 grow justify-center text-5xl font-light"
      >
        <div class="celsius" class:negative={weather.temperature < 0}>
          {Math.abs(weather.temperature)}
        </div>
      </div>
      <div
        class="flex h-full w-full justify-end space-x-2 self-center *:flex *:h-full *:w-16 *:flex-col *:items-center *:justify-center"
      >
        <div>
          <SvgIcon className="block size-5" d={humidity} outline />
          <div class="flex items-center space-x-0.5">
            <div class="text-right">{weather.relative_humidity}</div>
            <div class="text-[0.8em]">%</div>
          </div>
        </div>
        <div>
          <SvgIcon className="block size-5" d={windDirection} outline />
          <div
            class="flex items-center space-x-0.5"
            class:current-warning-text={weather.wind_speed_10 >
              SHOW_WINDSPEED_WARNING_AFTER}
          >
            <div class="text-right">
              {toLocalDecimal(weather.wind_speed_10 ?? 0)}
            </div>
            <div class="text-[0.8em]">
              <UnitXperY top="km" bottom="h" />
            </div>
          </div>
        </div>
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div
          class="clickable relative"
          onclick={() => (radarFilmPopupOpened = true)}
          role="button"
          tabindex="-1"
        >
          <SvgCorner></SvgCorner>
          <WeatherIcon monochrome icon={'rain'} class="size-5" />
          <div class="flex items-center space-x-0.5">
            <div class=" text-right">
              {toLocalDecimal(weather.precipitation_60)}
            </div>
            <UnitXperY top="mm" bottom="h" />
          </div>
        </div>
      </div>
    </div>
  {:else}
    <div class="skeleton h-16 w-full"></div>
  {/if}
</div>

<style>
  .current-warning-text {
    @apply font-semibold text-warning;
  }
</style>
