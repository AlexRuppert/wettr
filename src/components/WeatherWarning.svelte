<svelte:options immutable />

<script context="module">
  const DEFAULT_WARNING = {
    icon: mdiAlertDecagramOutline,
    title: '',
    description: '',
    time: '',
    instruction: '',
  }
  const ICON_LOOKUP = {
    1: mdiFanAlert,
    3: mdiSnowflakeAlert,
    default: mdiAlertDecagramOutline,
  }
</script>

<script lang="ts">
  import {
    mdiChevronDown,
    mdiAlertDecagramOutline,
    mdiFanAlert,
    mdiSnowflakeAlert,
  } from '@mdi/js'
  import SvgIcon from './icons/SvgIcon.svelte'
  import { fade } from 'svelte/transition'
  import {
    darkMode,
    weatherWarningData,
    locationCoordinates,
  } from '../stores/store'
  import { getDarkLightColor, COLORS } from '../logic/utils'
  import { nested } from 'point-in-polygon'
  import { isInBounds } from '../logic/radar/utils'

  let collapsed = true
  let mainItem = DEFAULT_WARNING
  let warnings = []
  let restWarnings = []

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
          instruction: warning.instruction.replace(
            'ACHTUNG! Hinweis auf mögliche Gefahren: ',
            ''
          ),
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

      mainItem = warnings?.[0] ?? DEFAULT_WARNING
      restWarnings = warnings.slice(1)
    }
  }

  function formatSingleTime(now, date) {
    const today = now.getDay() === date.getDay()
    return {
      ...Object.fromEntries(
        new Intl.DateTimeFormat('de-DE', {
          hour: 'numeric',
          day: '2-digit',
          weekday: 'short',
        })
          .formatToParts(date)
          .map(({ type, value }) => [type, value.replace(/\./g, '')])
      ),
      today,
    } as any
  }

  function formatTimes(now: Date, { start, end }) {
    const sameDay = start.getDay() === end.getDay()
    const formattedStart = formatSingleTime(now, start)
    const formattedEnd = formatSingleTime(now, end)

    return (
      (start < now
        ? 'bis '
        : (!formattedStart.today ? formattedStart.weekday + ' ' : '') +
          formattedStart.hour +
          ' - ') +
      (!formattedEnd.today && !sameDay ? formattedEnd.weekday + ' ' : '') +
      formattedEnd.hour +
      ' Uhr'
    )
  }

  function toggleCollapsed() {
    collapsed = !collapsed
  }
</script>

{#if warnings.length > 0}
  <div
    class="bg-white rounded-md  shadow-md mx-1 dark:bg-dark-600"
    in:fade={{ duration: 150 }}
  >
    <div
      class="rounded-md flex space-x-1 h-14 w-full clickable"
      on:click={toggleCollapsed}
      class:shadow-md={!collapsed}
    >
      <div class="flex h-5 px-3 w-5 self-center">
        <SvgIcon
          d={ICON_LOOKUP[mainItem.icon] ?? ICON_LOOKUP.default}
          fill={getDarkLightColor(COLORS.warning, $darkMode)}
        />
      </div>
      <div
        class="flex flex-grow font-semibold flex-shrink-0 self-center overflow-hidden overflow-ellipsis"
      >
        {mainItem.title}<span class="ml-[0.15rem] text-orange-600">!</span>
        {#if warnings.length > 1}
          <span
            class="font-light text-xs ml-2 tracking-wide tabular-nums self-center"
            >{`+(${warnings.length - 1})`}</span
          >
        {/if}
      </div>
      <div class="flex font-light text-xs self-center">
        {mainItem.time}
      </div>
      <div
        class="p-2 pt-3 transition-transform w-8 self-center"
        class:mirrored-y={!collapsed}
      >
        <SvgIcon
          d={mdiChevronDown}
          fill={!collapsed
            ? getDarkLightColor(COLORS.warning, $darkMode)
            : null}
        />
      </div>
    </div>
    <div
      class="rounded-md max-h-60 transform  origin-top transition-all relative height-transition overflow-hidden dark:bg-dark-800"
      class:max-h-0={collapsed}
      class:pb-2={!collapsed}
    >
      <div>
        <div
          class="h-7 w-full bottom-0 linear-fade absolute"
          class:dark={$darkMode}
        />
        <div
          class="h-full text-sm py-2 leading-5 overflow-y-auto box-border custom-scrollbar"
        >
          <div class="children:px-2">
            <div>
              {mainItem.description}
            </div>
            {#if !!mainItem.instruction}
              <div class="mt-2">
                <div class="font-semibold">
                  ACHTUNG! Hinweis auf mögliche Gefahren:
                </div>
                <div>
                  {mainItem.instruction}
                </div>
              </div>
            {/if}
          </div>
          <div class="py-5 children:px-2">
            {#each restWarnings as warning}
              <div
                class="flex space-x-1 bg-light-400 h-8 mt-5 mb-2 dark:bg-dark-500"
              >
                <div class="flex h-5 mr-2 ml-1 w-5 self-center">
                  <SvgIcon
                    d={ICON_LOOKUP[warning.icon] ?? ICON_LOOKUP.default}
                  />
                </div>
                <div
                  class="flex flex-grow font-semibold self-center overflow-hidden overflow-ellipsis"
                >
                  {warning.title}
                </div>
                <div
                  class="flex font-light text-xs pr-2 self-center tabular-nums "
                >
                  {warning.time}
                </div>
              </div>
              <div>
                {warning.description}
              </div>
              {#if !!warning.instruction}
                <div class="mt-2">
                  <div class="font-semibold">
                    ACHTUNG! Hinweis auf mögliche Gefahren:
                  </div>
                  <div>
                    {warning.instruction}
                  </div>
                </div>
              {/if}
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .height-transition {
    transition: max-height 0.5s ease-in-out;
  }
  .mirrored-y {
    transform: scaleY(-1);
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
