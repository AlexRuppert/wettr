<script lang="ts">
  import Popup from '@/components/common/Popup.svelte'
  import UnitXperY from '@/components/common/UnitXperY.svelte'
  import SvgIcon from '@/components/icons/SvgIcon.svelte'
  import WeatherIcon from '@/components/icons/WeatherIcon.svelte'
  import { humidity, windDirection } from '@/components/icons/icons'
  import { getLocationData } from '@/logic/locations'
  import { type CustomElement } from '@/logic/svelte.svelte'
  import { toLocalDecimal } from '@/logic/utils'
  import { type CurrentWeatherDataType } from '@/logic/weatherTypes'
  import {
    currentWeatherData,
    locationCoordinates,
    locationState,
  } from '@/stores/store.svelte'

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

{#if weather && weather.timestamp}
  <div
    class="flex select-none space-x-1 tabular-nums *:relative *:rounded-default *:bg-surface-500 *:shadow-md"
  >
    <div class="flex h-16 grow items-center justify-center">
      <div class="w-16 shrink-0 text-text-hard">
        <WeatherIcon className="pt-2 pl-2" icon={weather.icon} />
      </div>
      <div class="mb-1 flex w-24 shrink-0 justify-center text-5xl font-light">
        <div class="celsius" class:negative={weather.temperature < 0}>
          {Math.abs(weather.temperature)}
        </div>
      </div>
      <div
        class="flex h-full w-full justify-between self-center px-2 *:flex *:flex-col *:items-center *:self-center"
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

        <div>
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
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      class="w clickable group flex h-16 w-16 flex-col items-center justify-center"
      onclick={() => (radarFilmPopupOpened = true)}
      role="button"
      tabindex="-1"
    >
      <SvgCorner></SvgCorner>

      <div
        class="grid h-full w-full grid-cols-3 items-center gap-1 p-1 *:-mt-0.5 *:ml-0.5 *:opacity-40"
      >
        <WeatherIcon monochrome icon={'rain'} class={'w-5 pt-2'} />
        <WeatherIcon monochrome icon={'rain'} class={'w-5 pb-2'} />
        <WeatherIcon monochrome icon={'rain'} class={'w-5 pt-2'} />
        <div
          class="col-span-4 pb-1.5 text-center text-sm tracking-wider !opacity-100"
        >
          RADA
          <div class="-ml-1 inline-block -scale-x-100">R</div>
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
