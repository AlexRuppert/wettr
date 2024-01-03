<svelte:options immutable />

<script context="module">
  const DEFAULT_WARNING = {
    title: '',
    description: '',
    time: '',
    instruction: '',
  }
</script>

<script lang="ts">
  import WarningItem from '@/components/warnings/WarningItem.svelte'
  import WarningDescription from '@/components/warnings/WarningDescription.svelte'

  import { fade } from 'svelte/transition'
  import {
    darkMode,
    weatherWarningData,
    locationCoordinates,
  } from '@/stores/store.svelte'

  import { nested } from 'point-in-polygon'
  import { isInBounds } from '@/logic/utils'

  let collapsed = $state(true)
  const hintText = 'ACHTUNG! Hinweis auf mögliche Gefahren: '

  let { warning, warnings, restWarnings } = $derived(
    getWarnings(locationCoordinates.value, weatherWarningData.value),
  )

  function getWarnings(
    location: { lat: number; lon: number },
    weatherWarnings: any[],
  ) {
    let point = [location.lon, location.lat]

    const now = new Date()
    let warnings = weatherWarnings
      .map(warning => ({
        time: formatTimes(now, warning.time),
        level: warning.level,
        icon: warning.type,
        title: warning.event,
        description: warning.description,
        instruction: warning.instruction.replace(hintText, ''),
        regions: warning.regions,
      }))
      /**/ .filter(warning =>
        warning.regions.some(region => {
          return (
            isInBounds(location, region.bounds) && nested(point, region.polygon)
          )
        }),
      ) /**/

    return {
      warning: warnings?.[0] ?? DEFAULT_WARNING,
      warnings,
      restWarnings: warnings.slice(1),
    }
  }

  function formatSingleTime(now: Date, date: Date) {
    const today = now.getDay() === date.getDay()

    const weekday =
      new Intl.DateTimeFormat('de-DE', {
        weekday: 'short',
      }).formatToParts(date)[0].value + ' '
    const hour = date.getHours()

    return {
      hour,
      weekday,
      today,
    }
  }

  function formatTimes(now: Date, { start, end }) {
    const sameDay = start.getDay() === end.getDay()
    const [s, e] = [start, end].map(t => formatSingleTime(now, t))

    let timeString = ''
    if (start < now) {
      timeString += 'bis '
    } else {
      if (!s.today) timeString += s.weekday
      timeString += s.hour + ' - '
    }

    if (!e.today && !sameDay) timeString += e.weekday
    timeString += e.hour + ' Uhr'

    return timeString
  }

  function toggleCollapsed() {
    collapsed = !collapsed
  }
</script>

{#if warnings.length > 0}
  <div
    class="select-none rounded-default bg-surface-500 shadow-md"
    in:fade={{ duration: 150 }}
  >
    <WarningItem
      suffix={warnings.length > 1 ? `+${warnings.length - 1}` : ''}
      onclick={toggleCollapsed}
      title={warning.title}
      time={warning.time}
      {collapsed}
    />

    <div
      class="height-transition relative max-h-64 origin-top transform overflow-hidden rounded-b-md transition-all"
      class:!max-h-0={collapsed}
      class:pb-2={!collapsed}
    >
      <div class="h-64">
        <div
          class="linear-fade absolute bottom-0 h-7 w-full"
          class:dark={darkMode.value}
        />
        <div class="custom-scrollbar box-border h-full overflow-y-auto text-sm">
          <WarningDescription
            description={warning.description}
            instruction={warning.instruction}
            {hintText}
          />

          {#each restWarnings as warning}
            <WarningItem subItem title={warning.title} time={warning.time} />
            <WarningDescription
              description={warning.description}
              instruction={warning.instruction}
              {hintText}
            />
          {/each}
        </div>
      </div>
    </div>
  </div>
{/if}

<style global>
  .height-transition {
    transition: max-height 0.3s ease-in-out;
  }
</style>
