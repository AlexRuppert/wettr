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

  let weather
  $: weather = $currentWeatherData
</script>

<div
  class="flex space-x-1 h-32 mx-1 relative tabular-nums children:(shadow-md rounded-md bg-white w-32) children:dark:bg-dark-600 "
>
  <div class="relative">
    {#if weather && weather.timestamp}
      <div class="inset-0 absolute" transition:fade>
        <MiniRadar />
      </div>

      <div
        class="inset-0 absolute pointer-events-none children:(z-10 absolute pointer-events-none) "
      >
        <div
          class="h-7 -mt-3 text-shadow-xs -ml-3 top-1/2 left-1/2 w-7"
          transition:scale
        >
          <div class="h-full -mt-[0.30rem] -ml-[0.10rem] w-full ">
            <WindDirection direction={weather.windDirection} />
          </div>
        </div>
        <div class="right-1 bottom-2" transition:scale>
          {toLocalDecimal(weather.windSpeed)}
          <span class="text-xs text-size-[0.5rem]"
            ><sup>km</sup>/<sub>h</sub></span
          >
        </div>

        {#if weather.precipitation > 0.5}
          <div class="flex bottom-2 left-1" transition:scale>
            <div class="h-4 mr-1 w-4 self-center">
              <SvgIcon d={umbrellaOpen} />
            </div>
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
  <div class="h-32 w-32 relative">
    {#if weather && weather.timestamp}
      {#key weather.icon}
        <div class="inset-2 absolute" transition:scale>
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
  <div class="flex p-2 box-border relative justify-end">
    {#if weather && weather.timestamp}
      <div class="">
        <div
          class="flex font-light h-full mt-3 text-right text-7xl"
          transition:scale
        >
          <span class="text-right"
            ><span
              class="max-w-4 inline-flex overflow-hidden"
              class:hidden={weather.temperature >= 0}>-</span
            >{Math.abs(weather.temperature)}
          </span><span class="font-light text-sm leading-[2.2]">°</span>
        </div>

        <div class="flex right-2 bottom-2 absolute" transition:scale>
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
