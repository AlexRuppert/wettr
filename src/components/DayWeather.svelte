<script lang="ts">
  import DayChart from '@/components/DayChart.svelte'
  import MoonPhase from '@/components/icons/MoonPhase.svelte'
  import WeatherIcon from '@/components/icons/WeatherIcon.svelte'
  import { type DayWeatherDataType } from '@/logic/weatherTypes'
  import { weatherData } from '@/stores/store'
  import { scale } from 'svelte/transition'

  let weather: DayWeatherDataType[] = $derived($weatherData)

  let formattedDay = $derived(
    weather.map(w => {
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
    }),
  )
</script>

<div class="grid select-none gap-1 font-light tabular-nums">
  {#each weather as day, i (day)}
    <div
      class="flex h-32 flex-col overflow-hidden rounded-default bg-surface-500 pt-1 shadow-md"
    >
      <div class="flex justify-between pl-2 pr-1" in:scale>
        <div class="w-28 text-3xl">
          <span>{formattedDay[i].day}</span>
          <span class="-ml-1 text-lg">{formattedDay[i].weekday}</span>
        </div>
        <div class="flex w-32 justify-between">
          {#each day.dayParts as { icon }, j (i + '' + j)}
            <div class="relative flex h-8 w-8 items-center self-end">
              {#key day.dayParts}
                <div class="absolute inset-0" in:scale={{ delay: j * 50 }}>
                  <WeatherIcon {icon} />
                </div>
              {/key}
            </div>
          {/each}
        </div>
        <div class="w-28 text-right text-3xl">
          <span class="text-lg"
            ><span>{day.min.temperature}</span><span
              class="inline-block align-text-top text-sm">°</span
            ></span
          >
          <span class:cold={day.max.temperature < 0}
            ><span>{day.max.temperature}</span><span class="align-top text-sm"
              >°</span
            ></span
          >
        </div>
      </div>
      <div class="relative overflow-hidden">
        <DayChart weather={day} />
        <div class="absolute bottom-0.5 left-1 z-10 size-2">
          <MoonPhase timestamp={day.day} />
        </div>
      </div>
    </div>
  {/each}
</div>
