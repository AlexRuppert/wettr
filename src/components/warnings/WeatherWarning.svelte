<script lang="ts">
  import WarningDescription from '@/components/warnings/WarningDescription.svelte'
  import WarningItem from '@/components/warnings/WarningItem.svelte'

  import { weatherWarningData } from '@/stores/store.svelte'
  import { fade } from 'svelte/transition'
  import Popup from '../common/Popup.svelte'
  import Button from '../common/Button.svelte'
  import SvgCorner from '../icons/SvgCorner.svelte'

  let opened = $state(false)
  const hintText = 'ACHTUNG! Hinweis auf mögliche Gefahren: '

  let warnings = $derived(getWarnings(weatherWarningData.value ?? []))

  function getWarnings(weatherWarnings: any[]) {
    const now = new Date()
    let warnings = weatherWarnings.map(warning => ({
      ...warning,
      time: formatTimes(now, warning.time),
      instruction: warning.instruction.replace(hintText, ''),
    }))

    return warnings
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

    const s = formatSingleTime(now, start)
    const e = formatSingleTime(now, end)
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
</script>

<Popup bind:opened>
  {#each warnings as { event, time, description, instruction }}
    <WarningItem {event} {time} class="bg-surface-500" />
    <WarningDescription {description} {instruction} {hintText} />
  {/each}
</Popup>

{#if warnings.length > 0}
  <Button class="bg-surface-500 relative shadow-md select-none">
    <WarningItem
      onclick={() => (opened = true)}
      event={warnings[0].event +
        (warnings.length > 1 ? ` +${warnings.length - 1}` : '')}
      time={warnings[0].time}
    />
    <SvgCorner class="text-warning"></SvgCorner>
  </Button>
{/if}
