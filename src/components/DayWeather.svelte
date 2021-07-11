<script lang="ts">
  import type { WeatherDataType } from 'src/logic/weatherTypes'
  import DayChart from './DayChart.svelte'
  import { weatherData } from '../stores/store'
  import WeatherIcon from './icons/WeatherIcon.svelte'

  let weather: {
    day: Date
    morning: any
    noon: any
    evening: any
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

<div class="flex flex-col flex-nowrap tabular-nums font-thin">
  {#each weather as { day, morning, noon, evening, max, min }, i (day)}
    <div class="border-b last:(border-b-0)">
      <div class="flex justify-between">
        <div class="text-3xl pl-2 w-28">
          <span>{formattedDay[i].day}</span>
          <span class="text-lg -ml-1">{formattedDay[i].weekday}</span>
        </div>

        <div class="flex mt-2.5 children:w-8 space-x-4">
          <div><WeatherIcon icon={morning.icon} /></div>
          <div><WeatherIcon icon={noon.icon} /></div>
          <div><WeatherIcon icon={evening.icon} /></div>
        </div>
        <div class="text-3xl pl-2 w-28 text-right">
          <span class="text-lg">{min.temperature}°</span>
          <span class="font-normal">{max.temperature}°</span>
        </div>
      </div>

      <DayChart weather={weather[i]} />
      {#if i < weather.length - 1}
        <div
          class="-mx-3 mt-3 mb-5 border-0 border-b border-solid border-gray-300"
        />
      {/if}
    </div>
  {/each}
</div>
