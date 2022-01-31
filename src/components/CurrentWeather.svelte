<script lang="ts">
  import WeatherIcon from './icons/WeatherIcon.svelte'
  import WindDirection from './icons/WindDirection.svelte'
  import MiniRadar from './radar/MiniRadar.svelte'
  import { currentWeatherData, darkMode } from '../stores/store'
  import { fly, draw, fade, scale, slide, blur } from 'svelte/transition'
  import { getDarkLightColor, getWeatherIconColors } from '../logic/utils'
  import { humidity, umbrellaOpen } from './icons/icons'
  import SvgIcon from './icons/SvgIcon.svelte'

  function toLocalDecimal(num, precision = 0) {
    return Number.parseFloat(num).toFixed(precision).toLocaleString()
  }

  const ANIMATION_DURATION = 150
  let weather
  $: weather = $currentWeatherData
</script>

<div
  class="flex space-x-1 h-32 mx-1 relative tabular-nums children:(shadow-md rounded-md bg-white w-32 relative) "
>
  <div class="dark:bg-dark-600">
    {#if weather && weather.timestamp}
      <div
        class="inset-0 absolute"
        transition:fade={{ duration: ANIMATION_DURATION }}
      >
        <MiniRadar />
      </div>

      <div
        class="text-shadow-light inset-0 absolute pointer-events-none children:(z-10 absolute pointer-events-none) "
      >
        <div
          class="h-7 -mt-3  -ml-3 top-1/2 left-1/2 w-7"
          transition:scale={{ duration: ANIMATION_DURATION }}
        >
          <div class="h-full -mt-[0.30rem] -ml-[0.10rem] w-full">
            <WindDirection direction={weather.windDirection} />
          </div>
        </div>
        <div
          class="right-1 bottom-2"
          transition:scale={{ duration: ANIMATION_DURATION }}
        >
          {toLocalDecimal(weather.windSpeed)}
          <span class="text-xs text-size-[0.5rem]"
            ><sup>km</sup>/<sub>h</sub></span
          >
        </div>

        {#if weather.precipitation > 0.5}
          <div
            class="flex bottom-2 left-1"
            transition:scale={{ duration: ANIMATION_DURATION }}
          >
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
    {/if}
  </div>
  <div class="h-32 w-32 dark:bg-dark-600">
    {#if weather && weather.timestamp}
      {#key weather.icon}
        <div
          class="inset-2 absolute"
          transition:scale={{ duration: ANIMATION_DURATION }}
        >
          <WeatherIcon
            icon={weather.icon}
            color={getDarkLightColor(
              getWeatherIconColors(weather.icon),
              $darkMode
            )}
          />
        </div>
      {/key}
    {/if}
  </div>
  <div class="flex p-2 box-border  justify-end dark:bg-dark-600">
    {#if weather && weather.timestamp}
      <div class="">
        <div
          class="flex font-light h-full mt-3 text-right text-7xl"
          transition:scale={{ duration: ANIMATION_DURATION }}
        >
          <span class="text-right"
            ><span
              class="max-w-4 inline-flex overflow-hidden"
              class:hidden={weather.temperature >= 0}>-</span
            >{Math.abs(weather.temperature)}
          </span><span class="font-light text-sm leading-[2.2]">°</span>
        </div>

        <div
          class="flex right-2 bottom-2 absolute"
          transition:scale={{ duration: ANIMATION_DURATION }}
        >
          <div class="h-4 w-5 self-center">
            <SvgIcon d={humidity} />
          </div>
          <div>
            {weather.relativeHumidity}
          </div>
          <span class="ml-[.1rem] text-size-[0.5rem] leading-[2.1]">%</span>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .text-shadow-light {
    text-shadow: 0 0 2px rgba(235, 235, 238, 1);
  }
  :global(.dark .text-shadow-light) {
    text-shadow: 0 0 2px rgba(15, 15, 15, 1);
  }
</style>
