<script lang="ts">
  import WarningDescription from '@/components/warnings/WarningDescription.svelte'
  import WarningItem from '@/components/warnings/WarningItem.svelte'

  import { weatherWarningData } from '@/stores/store.svelte'
  import { fade } from 'svelte/transition'
  import Popup from '../common/Popup.svelte'

  let popupOpened = $state(false)
  const hintText = 'ACHTUNG! Hinweis auf mögliche Gefahren: '

  let warnings = $derived(getWarnings(weatherWarningData.value ?? []))

  function getWarnings(weatherWarnings: any[]) {
    const now = new Date()
    let warnings = weatherWarnings.map(warning => ({
      time: formatTimes(now, warning.time),
      level: warning.level,
      icon: warning.type,
      title: warning.event,
      description: warning.description,
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
</script>

<Popup bind:opened={popupOpened}>
  <div>
    {#each warnings as warning}
      <WarningItem subItem title={warning.title} time={warning.time} />
      <WarningDescription
        description={warning.description}
        instruction={warning.instruction}
        {hintText}
      />
    {/each}
  </div>
</Popup>

{#if warnings.length > 0}
  <div
    class="bg-surface-500 rounded-md shadow-md select-none"
    in:fade={{ duration: 150 }}
  >
    <WarningItem
      suffix={warnings.length > 1 ? `+${warnings.length - 1}` : ''}
      onclick={() => (popupOpened = true)}
      title={warnings[0].title}
      time={warnings[0].time}
    />
  </div>
{/if}

<style global>
</style>
