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
  import WarningItem from './WarningItem.svelte'
  import WarningDescription from './WarningDescription.svelte'
  import { fade } from 'svelte/transition'
  import {
    darkMode,
    weatherWarningData,
    locationCoordinates,
  } from '../../stores/store'

  import { nested } from 'point-in-polygon'
  import { isInBounds } from '../../logic/radar/utils'

  let collapsed = true
  let warning = DEFAULT_WARNING
  let warnings = []
  let restWarnings = []

  const hintText = 'ACHTUNG! Hinweis auf mögliche Gefahren: '

  $: {
    let location = $locationCoordinates
    let point = [location.lon, location.lat]
    if ($weatherWarningData.length > 0) {
      const now = new Date()
      warnings = $weatherWarningData
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
              isInBounds(location, region.bounds) &&
              nested(point, region.polygon)
            )
          })
        ) /**/

      warning = warnings?.[0] ?? DEFAULT_WARNING
      restWarnings = warnings.slice(1)
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
    class="bg-white rounded-md shadow-md mx-1 select-none dark:bg-dark-600"
    in:fade={{ duration: 150 }}
  >
    <WarningItem
      suffix={warnings.length > 1 ? `+${warnings.length - 1}` : ''}
      on:click={toggleCollapsed}
      title={warning.title}
      time={warning.time}
      {collapsed}
    />

    <div
      class="rounded-b-md max-h-60 transform origin-top transition-all relative height-transition overflow-hidden dark:bg-dark-800"
      class:max-h-0={collapsed}
      class:pb-2={!collapsed}
    >
      <div class="h-60">
        <div
          class="h-7 w-full bottom-0 linear-fade absolute"
          class:dark={$darkMode}
        />
        <div class="h-full text-sm overflow-y-auto box-border custom-scrollbar">
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
    transition: max-height 0.5s ease-in-out;
  }

  .linear-fade {
    background: linear-gradient(
      0,
      rgb(255, 255, 255) 0 20%,
      rgb(255, 255, 255, 0.7),
      rgba(255, 255, 255, 0)
    );
  }
  .dark.linear-fade {
    background: linear-gradient(
      0,
      rgb(24, 24, 24) 0 20%,
      rgb(24, 24, 24, 0.7),
      rgba(24, 24, 24, 0)
    );
  }
</style>
