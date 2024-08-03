<script lang="ts">
  import DayChart from '@/components/DayChart.svelte'
  import MoonPhase from '@/components/icons/MoonPhase.svelte'
  import WeatherIcon from '@/components/icons/WeatherIcon.svelte'
  import { FORECAST_DAYS } from '@/logic/reloader'
  import { type DayWeatherData } from '@/logic/weatherTypes'
  import { weatherData } from '@/stores/store.svelte'
  import { fade, scale } from 'svelte/transition'

  let weather: DayWeatherData[] = $derived(weatherData.value)
  let dummySkeletonDays = new Array(FORECAST_DAYS + 1)
  let formattedDay = $derived(
    weather.map(w => {
      const formatted = new Intl.DateTimeFormat('de-DE', {
        day: 'numeric',
        weekday: 'short',
      }).formatToParts(w.day)

      return {
        day: formatted.find(f => f.type === 'day').value,
        weekday: formatted
          .find(f => f.type === 'weekday')
          .value.replace(/\./g, ''),
        isWeekend: w.day.getDay() % 6 === 0,
      }
    }),
  )
</script>

<div class="grid select-none gap-1 font-light tabular-nums">
  {#if weather?.length > 0}
    {#each weather as day, i (day)}
      <div
        transition:fade={{ duration: 200 }}
        class="flex h-32 overflow-hidden rounded-default bg-surface-500 shadow-md"
      >
        <div
          class="right-box relative flex w-14 flex-col items-center justify-between bg-surface-400"
          class:rain={day.daySummary.iconClass == 'rain'}
          class:sun={day.daySummary.iconClass == 'sun'}
        >
          <div class="flex justify-center">
            <div
              class="relative flex size-8 items-center self-end"
              style="stroke-width:1.5"
            >
              <WeatherIcon
                icon={day.daySummary.icon}
                className=" absolute inset-0 top-1 left-0.5"
              />
            </div>
          </div>
          <div class="flex w-full flex-col items-end text-3xl *:flex">
            <div class="-mb-1 mr-3">
              <div class="celsius" class:negative={day.max.temperature < 0}>
                {Math.abs(day.max.temperature)}
              </div>
            </div>

            <div class="mr-3 mt-1 items-end justify-end text-lg">
              <div class="celsius" class:negative={day.min.temperature < 0}>
                {Math.abs(day.min.temperature)}
              </div>
            </div>
          </div>
          <div
            class="mr-4 flex w-full justify-end space-x-0.5 text-base font-light *:flex"
          >
            <div
              class="justify-end font-medium"
              class:text-highlight={formattedDay[i].isWeekend}
            >
              {formattedDay[i].day}
            </div>
            <div class="items-end">
              {formattedDay[i].weekday}
            </div>
          </div>
        </div>
        <div class="relative grow overflow-hidden">
          <DayChart weather={day} />
          <div class="absolute bottom-[5px] right-1 z-10 size-2">
            <MoonPhase timestamp={day.day} />
          </div>
        </div>
      </div>
    {/each}
  {:else}
    {#each dummySkeletonDays as day, i}
      <div
        class="skeleton h-32 w-full overflow-hidden rounded-default bg-surface-500 shadow-md"
      ></div>
    {/each}
  {/if}
</div>

<style>
</style>
