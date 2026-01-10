<script lang="ts">
  import Popup from '@/components/common/Popup.svelte'
  import UnitXperY from '@/components/common/UnitXperY.svelte'
  import SvgIcon from '@/components/icons/SvgIcon.svelte'
  import WeatherIcon from '@/components/icons/WeatherIcon.svelte'
  import {
    humidity,
    weatherCloudOpen,
    weatherRain,
    weatherWind,
  } from '@/components/icons/icons'
  import { getLocationData } from '@/logic/locations'
  import { type CustomElement } from '@/logic/svelte.svelte'
  import { getWeatherIconClass } from '@/logic/utils'
  import { type CurrentWeatherDataType } from '@/logic/weatherTypes'
  import {
    currentWeatherData,
    locationCoordinates,
    locationState,
  } from '@/stores/store.svelte'
  import { fade } from 'svelte/transition'
  import Button from './common/Button.svelte'
  import Lazy from './common/Lazy.svelte'
  import SvgCorner from './icons/SvgCorner.svelte'

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
</script>

<Popup bind:opened={radarFilmPopupOpened}>
  <Lazy
    loadIsTriggered={radarFilmPopupOpened}
    loadFn={() => import('./Radar.svelte')}
    params={{ coordinates: locationCoordinates.value }}
  />
</Popup>

{#snippet indicator(
  iconPath: string,
  top: string,
  bottom: string,
  value: number,
  cls?: any,
)}
  <div class={['flex h-full w-16 flex-col items-center justify-center', cls]}>
    <SvgIcon class="size-6" d={iconPath} />
    <UnitXperY {top} {bottom} {value} />
  </div>
{/snippet}

<div
  class="bg-surface-500 flex space-x-1 rounded-md tabular-nums select-none *:relative *:h-16 *:rounded-md *:shadow-md"
>
  {#if weather && weather.timestamp}
    <div
      transition:fade={{ duration: 200 }}
      class={[
        'flex grow items-center',
        {
          'bg-rain/10': getWeatherIconClass(weather.icon) == 'rain',
          'bg-sun/10': getWeatherIconClass(weather.icon) == 'sun',
        },
      ]}
    >
      <WeatherIcon
        class="w-16 shrink-0 pt-2 pl-2"
        icon={weather.icon}
        strokeWidth={2}
      />

      <div class="flex w-24 shrink-0 justify-center text-5xl font-light">
        <div class={['celsius', { negative: weather.temperature < 0 }]}>
          {Math.abs(weather.temperature)}
        </div>
      </div>

      <div class="flex size-full justify-end space-x-2">
        {@render indicator(humidity, '%', '%', weather.relative_humidity)}
        {@render indicator(weatherWind, 'km', 'h', weather.wind_speed_10, {
          'text-warning font-semibold':
            weather.wind_speed_10 > SHOW_WINDSPEED_WARNING_AFTER,
        })}

        <Button
          class="relative w-16"
          onclick={() => (radarFilmPopupOpened = true)}
        >
          <SvgCorner></SvgCorner>
          {@render indicator(
            weatherCloudOpen + weatherRain,
            'mm',
            'h',
            weather.precipitation_60,
          )}
        </Button>
      </div>
    </div>
  {:else}
    <div class="skeleton w-full"></div>
  {/if}
</div>
