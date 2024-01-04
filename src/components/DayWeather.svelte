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

<!--
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
-->

<div class="grid select-none gap-1 font-light tabular-nums">
  {#each weather as day, i (day)}
    <div
      class="flex h-32 overflow-hidden rounded-default bg-surface-500 shadow-md"
    >
      <div
        class="right-box relative flex w-20 flex-col items-center justify-between bg-surface-400"
        class:rain={day.daySummary.iconClass == 'rain'}
        class:sun={day.daySummary.iconClass == 'sun'}
      >
        <div class="flex w-full space-x-1 text-3xl *:flex *:w-1/2">
          <div class="justify-end">{formattedDay[i].day}</div>
          <div class="push-down items-end text-lg">
            {formattedDay[i].weekday}
          </div>
        </div>
        <div class="flex justify-center">
          <div class="relative flex size-12 items-center self-end pt-1">
            <WeatherIcon icon={day.daySummary.icon} />
          </div>
        </div>
        <div class="flex w-full space-x-1 text-3xl *:flex *:w-1/2">
          <div class="justify-end">
            <div class="celsius" class:text-rain={day.max.temperature < 0}>
              {day.max.temperature}
            </div>
          </div>

          <div class="items-end text-lg">
            <div
              class="celsius push-down"
              class:text-rain={day.min.temperature < 0}
            >
              {day.min.temperature}
            </div>
          </div>
        </div>
        <div class="absolute right-1 top-2 z-10 size-2">
          <MoonPhase timestamp={day.day} />
        </div>
      </div>
      <div class="relative grow overflow-hidden">
        <DayChart weather={day} />
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

  .rain {
    @apply bg-rain/10;
  }
  .sun {
    @apply bg-sun/10;
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
</style>
