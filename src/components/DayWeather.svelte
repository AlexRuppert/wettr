<script lang="ts">
  import type { WeatherDataType } from 'src/logic/weatherTypes'
  import DayChart from './DayChart.svelte'
  import { darkMode, weatherData } from '../stores/store'
  import WeatherIcon from './icons/WeatherIcon.svelte'
  import { getDarkLightColor } from '../logic/utils'
  import { fade } from 'svelte/transition'

  let weather: {
    day: Date
    dayParts: any
    max: any
    min: any
    dayGraph: any
    dayLight: any
    data: WeatherDataType[]
  }[]
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
      day: formatted.find(f => f.type === 'day').value,
      weekday: formatted
        .find(f => f.type === 'weekday')
        .value.replace(/\./g, ''),
    }
  })
</script>

{#if weather && weather.length > 0}
  <div
    class="flex flex-col flex-nowrap font-light space-y-1 mx-1 transition-opacity duration-700 tabular-nums"
    transition:fade={{ duration: 250 }}
  >
    {#each weather as { day, dayParts, max, min }, i (day)}
      <div class="bg-white rounded-md shadow-md py-1 px-2 dark:bg-dark-600">
        <div class="flex justify-between">
          <div class="pl-1 text-3xl w-28">
            <span>{formattedDay[i].day}</span>
            <span class="text-lg -ml-1">{formattedDay[i].weekday}</span>
          </div>
          <div class="flex space-x-4 ">
            {#each dayParts as { icon, colors }}
              <div class="flex pt-1.5 w-8 items-center">
                <WeatherIcon
                  {icon}
                  color={getDarkLightColor(colors, $darkMode)}
                />
              </div>
            {/each}
          </div>
          <div class="text-right text-3xl w-28">
            <span class="text-lg" class:cold={min.temperature < 0}
              >{min.temperature}<span class="text-sm align-text-top">°</span
              ></span
            >
            <span class:cold={max.temperature < 0}
              >{max.temperature}<span
                class="text-sm ml-[0.1rem] leading-[1.8] align-top">°</span
              ></span
            >
          </div>
        </div>
        <DayChart weather={weather[i]} />
      </div>
    {/each}
  </div>
{/if}

<style>
  .cold {
    @apply text-blue-600 dark:text-blue-400;
  }
</style>
