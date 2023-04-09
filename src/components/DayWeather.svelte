<script lang="ts">
  import type {
    DayWeatherDataType,
    WeatherDataType,
    WeatherIconType,
  } from 'src/logic/weatherTypes'

  import DayChart from './DayChart.svelte'
  import { weatherData } from '../stores/store'
  import WeatherIcon from './icons/WeatherIcon.svelte'
  import { fly, scale } from 'svelte/transition'
  import { FORECAST_DAYS } from '../logic/reloader'
  import MoonPhase from './icons/MoonPhase.svelte'

  let weather: DayWeatherDataType[]
  $: {
    weather = $weatherData
  }

  let formattedDay
  $: formattedDay = weather.map(w => {
    const formatted = new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      weekday: 'short',
    }).formatToParts(w.day)

    return {
      day: formatted.find(f => f.type === 'day').value.replace(/^0/g, ''),
      weekday: formatted
        .find(f => f.type === 'weekday')
        .value.replace(/\./g, ''),
    }
  })

  let dummy = [...Array(FORECAST_DAYS + 1).keys()]
</script>

<div
  class="flex flex-col flex-nowrap font-light space-y-1 mx-0.5 tabular-nums select-none"
>
  {#each dummy as index, i (index)}
    <div
      class="bg-white rounded-md flex flex-col h-30 shadow-md pt-1 overflow-hidden dark:bg-dark-600"
    >
      {#if weather && weather.length > 0}
        <div class="flex pr-1 pl-2 justify-between" transition:scale>
          <div class="text-3xl w-28">
            <span>{formattedDay[i].day}</span>
            <span class="text-lg -ml-1">{formattedDay[i].weekday}</span>
          </div>
          <div class="flex w-32 justify-between">
            {#each weather[index].dayParts as { icon }, j (i + '' + j)}
              <div class="flex h-8 w-8 items-center relative self-end">
                {#key weather[index].dayParts}
                  <div
                    class="inset-0 absolute"
                    transition:scale={{ delay: j * 50 }}
                  >
                    <WeatherIcon {icon} />
                  </div>
                {/key}
              </div>
            {/each}
          </div>
          <div class="text-right text-3xl w-28">
            <span
              class="text-lg"
              class:cold={weather[index].min.temperature < 0}
              >{weather[index].min.temperature}<span
                class="text-sm align-text-top">°</span
              ></span
            >
            <span class:cold={weather[index].max.temperature < 0}
              >{weather[index].max.temperature}<span class="text-sm align-top"
                >°</span
              ></span
            >
          </div>
        </div>
        <div class="overflow-hidden relative">
          <DayChart weather={weather[index]} />
          <div class="h-2 bottom-3 left-1 w-2 z-10 absolute">
            <MoonPhase timestamp={weather[index].day} />
          </div>
        </div>
      {/if}
    </div>
  {/each}
</div>

<style global>
  .cold {
    @apply text-blue-600 dark:text-blue-400;
  }
</style>
