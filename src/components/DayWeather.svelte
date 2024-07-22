<script lang="ts">
  import DayChart from '@/components/DayChart.svelte'
  import MoonPhase from '@/components/icons/MoonPhase.svelte'
  import WeatherIcon from '@/components/icons/WeatherIcon.svelte'
  import { type DayWeatherData } from '@/logic/weatherTypes'
  import { weatherData } from '@/stores/store.svelte'
  import { scale } from 'svelte/transition'

  let weather: DayWeatherData[] = $derived(weatherData.value)

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
      }
    }),
  )
</script>

<div class="grid select-none gap-1 font-light tabular-nums">
  {#each weather as day, i (day)}
    <div
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
          class="mr-5 flex w-full justify-end space-x-0.5 text-base font-light *:flex"
        >
          <div class="justify-end font-medium">{formattedDay[i].day}</div>
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
</div>

<style>
  .right-box {
    box-shadow: inset -7px 0 9px -7px rgba(0, 0, 0, 0.15);
  }
  :global(.dark) .right-box {
    box-shadow: inset -7px 0 9px -7px rgba(0, 0, 0, 0.4);
  }

  .celsius {
    @apply relative;
  }
  .celsius::after {
    content: '°';
    top: -0.1rem;
    right: -0.25rem;
    @apply absolute text-sm;
  }
  .push-down {
    margin-bottom: -0.1em;
  }

  .celsius.negative {
    @apply text-rain;
  }
  .celsius.negative::before {
    content: '-';
    top: 0;
    left: -0.4em;
    @apply absolute;
  }
</style>
