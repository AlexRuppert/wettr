<script lang="ts">
  import {
    radarOpen,
    cloudData,
    locationCoordinates,
    darkMode,
  } from '../../stores/store'

  import { onMount, tick } from 'svelte'
  import { reloadClouds } from '../../logic/reloader'
  import { filterClouds } from '../../logic/radar/clouds'
  import ModalBackground from '../ModalBackground.svelte'
  import { isLocationSet } from '../../logic/locations'
  import { getForegroundColor } from '../../logic/utils'
  import SvgIcon from '../icons/SvgIcon.svelte'
  import { mdiSkipNext, mdiSkipPrevious } from '@mdi/js'
  import { fly } from 'svelte/transition'
  import { swipe } from 'svelte-gestures'
  import SatelliteComposite from './SatelliteComposite.svelte'
  const YEAR = 2019
  const QUELLENVERMERK = `© Europäische Union, enthält Copernicus Sentinel-2 Daten ${YEAR}, verarbeitet durch das
Bundesamt für Kartographie und Geodäsie (BKG)`

  let min = 0
  let max: number
  let sliderValue = min
  let times = []

  let clouds = []
  let cloudsToShow = []
  let viewBounds

  $: if ($radarOpen && isLocationSet($locationCoordinates)) reloadClouds()
  $: {
    if ($cloudData?.viewBounds?.lb) {
      update($cloudData)
    }
  }
  $: {
    const selectedTime = times[sliderValue]
    if (selectedTime) {
      scrollTime(selectedTime)
    }
  }

  function update(cloudData) {
    viewBounds = cloudData.viewBounds
    times = cloudData.times
    clouds = cloudData.clouds
    max = times.length - 1
  }

  function scrollTime(time) {
    cloudsToShow = filterClouds(clouds, time)
  }

  onMount(async () => {
    await tick()
  })

  function displayTime(time) {
    return new Intl.DateTimeFormat('default', {
      hourCycle: 'h23',
      hour: 'numeric',
      minute: 'numeric',
    }).format(time)
  }

  function close() {
    $radarOpen = false
  }
</script>

<ModalBackground show={$radarOpen} on:close={close} />

{#if $radarOpen}
  <div
    class="absolute space-y-2 flex flex-col children:(shadow-md rounded-md max-w-sm p-2 bg-white mx-5 z-20) left-0 right-0 top-0 z-20 select-none"
    transition:fly={{ y: -300 }}
    use:swipe={{ timeframe: 500, minSwipeDistance: 35, touchAction: 'none' }}
    on:swipe={({ detail }) => (detail.direction === 'top' ? close() : null)}
  >
    <div class="flex-col mt-2 dark:bg-dark-600">
      <div class="text-size-xl pt-2 pb-4 text-center" on:click={close}>
        <span>Regenradar</span>
        <span
          class="absolute right-5 text-lg font-extralight px-3 cursor-pointer"
          role="button"
          on:click={close}>×</span
        >
      </div>
      <SatelliteComposite clouds={cloudsToShow} {viewBounds} />
      <div class="controls z-50 mt-5 mb-10 space-y-3">
        <div class="text-center w-full font-light text-xl tabular-nums">
          {displayTime(times[sliderValue])}
        </div>
        <div class="flex">
          <button
            class="button"
            on:click={() => (sliderValue = Math.max(0, sliderValue - 1))}
            aria-label="Go Back"
          >
            <SvgIcon
              d={mdiSkipPrevious}
              dim={{ w: 24, h: 24 }}
              fill={getForegroundColor($darkMode)}
            />
          </button>
          <span class="w-full mx-5 mt-0.5">
            <input type="range" bind:value={sliderValue} {min} {max} />
          </span>

          <button
            class="button"
            on:click={() => (sliderValue = Math.min(max, sliderValue + 1))}
            aria-label="Go Forward"
          >
            <SvgIcon
              d={mdiSkipNext}
              dim={{ w: 24, h: 24 }}
              fill={getForegroundColor($darkMode)}
            />
          </button>
        </div>
      </div>
    </div>
    <div class="source text-center dark:bg-dark-600">
      <a href="https://www.bkg.bund.de">{QUELLENVERMERK}</a>
    </div>
  </div>
{/if}

<style>
  .source a {
    @apply text-xs no-underline font-normal text-gray-700 hover:underline;
    letter-spacing: -0.07em;
  }
  .dark .source a {
    @apply text-gray-600;
  }

  div {
    --thumb-bg: #2784ff;
    --progress-bg: #2784ff;
    --track-bg: #444444;
  }
  .button {
    @apply bg-transparent dark:(hover:bg-dark-400 active:bg-dark-200) hover:bg-blue-gray-100  active:bg-blue-gray-200 rounded border-none w-15 h-10 cursor-pointer flex items-center p-1;
  }
  button {
    touch-action: manipulation;
  }

  :global(.thumb-content .thumb) {
    @apply w-7 h-7;
  }

  input[type='range'] {
    width: 100%;
    margin: 0;
    background-color: transparent;
    -webkit-appearance: none;
  }

  input[type='range']:focus {
    outline: none;
  }
  input[type='range']::-webkit-slider-runnable-track {
    background: #aaaaaa10;
    border-radius: 25px;
    width: 100%;
    cursor: pointer;
    height: 32px;
  }

  input[type='range']::-webkit-slider-thumb {
    border-radius: 32px;
    background: #006efd;
    border: 1px solid #006efd;
    height: 32px;
    width: 32px;
    -webkit-appearance: none;
  }

  input[type='range']::-moz-range-track {
    background: #aaaaaa10;
    border-radius: 25px;
    width: 100%;
    cursor: pointer;
    height: 32px;
  }

  input[type='range']::-moz-range-thumb {
    border-radius: 32px;
    background: #006efd;
    border: 1px solid #006efd;
    height: 32px;
    width: 32px;
    -webkit-appearance: none;
  }
</style>
