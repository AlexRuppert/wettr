<script lang="ts">
  import Popup from '@/components/common/Popup.svelte'
  import UnitXperY from '@/components/common/UnitXperY.svelte'
  import SvgIcon from '@/components/icons/SvgIcon.svelte'
  import WeatherIcon from '@/components/icons/WeatherIcon.svelte'
  import { humidity, windDirection } from '@/components/icons/icons'
  import { getLocationData } from '@/logic/locations'
  import { type CustomElement } from '@/logic/svelte.svelte'
  import { cn, getWeatherIconClass, toLocalDecimal } from '@/logic/utils'
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
</script>

<Popup bind:opened={radarFilmPopupOpened}>
  {#if lazyRadar}
    {#await lazyRadar then { default: Radar }}
      <Radar coordinates={locationCoordinates.value} />
    {/await}
  {/if}</Popup
>

<div
  class="rounded-default bg-surface-500 *:rounded-default *:bg-surface-500 flex space-x-1 tabular-nums select-none *:relative *:shadow-md"
>
  {#if weather && weather.timestamp}
    <div
      transition:fade={{ duration: 200 }}
      class={cn('flex h-16  grow  items-center justify-center', {
        'bg-rain/10': getWeatherIconClass(weather.icon) == 'rain',
        'bg-sun/10': getWeatherIconClass(weather.icon) == 'sun',
      })}
    >
      <div class="text-text-hard w-16 shrink-0">
        <WeatherIcon class="pt-2 pl-2" icon={weather.icon} strokeWidth={2} />
      </div>
      <div class="flex w-24 shrink-0 grow justify-center text-5xl font-light">
        <div class={cn('celsius', { negative: weather.temperature < 0 })}>
          {Math.abs(weather.temperature)}
        </div>
      </div>
      <div
        class="flex h-full w-full justify-end space-x-2 self-center *:flex *:h-full *:w-16 *:flex-col *:items-center *:justify-center"
      >
        <div>
          <SvgIcon class="block size-6" d={humidity} />
          <div class="flex items-center space-x-0.5">
            <div class="text-right">{weather.relative_humidity}</div>
            <div class="text-[0.8em]">%</div>
          </div>
        </div>
        <div>
          <SvgIcon class="block size-6" d={windDirection} />
          <div
            class={cn('flex items-center space-x-0.5', {
              'text-warning font-semibold':
                weather.wind_speed_10 > SHOW_WINDSPEED_WARNING_AFTER,
            })}
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
          <WeatherIcon monochrome icon={'rain'} class="size-6" />
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
