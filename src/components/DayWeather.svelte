<script lang="ts">
  import type { WeatherDataType } from 'src/logic/weatherTypes'

  import DayChart from './DayChart.svelte'
  import { weatherData } from '../stores/store'
  import WeatherIcon from './icons/WeatherIcon.svelte'
  import { fade, fly, blur, scale, slide, crossfade } from 'svelte/transition'

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

  let dummy = [...Array(6).keys()]
</script>

<div
  class="flex flex-col flex-nowrap font-light space-y-1 mx-1 transition-opacity duration-700 tabular-nums select-none"
>
  {#each dummy as index, i (index)}
    <div class="bg-white rounded-md h-30 shadow-md py-1 px-2 dark:bg-dark-600">
      {#if weather && weather.length > 0}
        <div class="flex justify-between" transition:scale>
          <div class="pl-1 text-3xl w-28">
            <span>{formattedDay[i].day}</span>
            <span class="text-lg -ml-1">{formattedDay[i].weekday}</span>
          </div>
          <div class="flex w-32 justify-between">
            {#each weather[index].dayParts as { icon, colors }, j (i + '' + j)}
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
              >{weather[index].max.temperature}<span
                class="text-sm ml-[0.1rem] leading-[1.8] align-top">°</span
              ></span
            >
          </div>
        </div>
        <div class="h-20" transition:fly={{ y: 15 }}>
          <DayChart weather={weather[index]} />
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
