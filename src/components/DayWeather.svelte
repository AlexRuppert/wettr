<script lang="ts">
  import type { WeatherDataType } from 'src/logic/weatherTypes'
  import DayChart from './DayChart.svelte'
  import { weatherData } from '../stores/store'
  import WeatherIcon from './icons/WeatherIcon.svelte'

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

<div class="flex flex-col flex-nowrap tabular-nums font-light space-y-1 transition-transform transform origin-top"
class:scale-y-0={Object.keys(weather??{}).length <= 0}>
  {#each weather as { day, dayParts, max, min }, i (day)}
    <div class="shadow-md rounded-md bg-white p-2">
      <div class="flex justify-between">
        <div class="text-3xl pl-1 w-28">
          <span>{formattedDay[i].day}</span>
          <span class="text-lg -ml-1">{formattedDay[i].weekday}</span>
        </div>
        <div class="flex children:(w-8 flex pt-2 items-center) space-x-4 ">
          {#each dayParts as {icon, color }}
            <div><WeatherIcon {icon} {color} /></div>
          {/each}
        </div>
        <div class="text-3xl w-28 text-right">
          <span class="text-lg">{min.temperature}°</span>
          <span class="font-normal">{max.temperature}°</span>
        </div>
      </div>
      <DayChart weather={weather[i]} />
    </div>
  {/each}
</div>
