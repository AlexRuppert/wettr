<script lang="ts">
  import {
    radarOpen,
    cloudData,
    locationCoordinates,
    darkMode,
  } from '../stores/store'

  import { onMount, tick } from 'svelte'
  import { getSateliteImageUrl } from '../logic/radar/radar'
  import { reloadClouds } from '../logic/reloader'
  import { filterClouds } from '../logic/radar/clouds'
  import Slider from '@bulatdashiev/svelte-slider'
  import ModalBackground from './ModalBackground.svelte'
  import RadarCanvas from './RadarCanvas.svelte'
  import { isLocationSet } from '../logic/locations'
  import { getLocationBounds } from '../logic/radar/utils'
  import { getForegroundColor } from '../logic/utils'
  import SvgIcon from './icons/SvgIcon.svelte'
  import { mdiSkipNext, mdiSkipPrevious } from '@mdi/js'
  const YEAR = 2019
  const QUELLENVERMERK = `© Europäische Union, enthält Copernicus Sentinel-2 Daten ${YEAR}, verarbeitet durch das
Bundesamt für Kartographie und Geodäsie (BKG)`

  let width: number
  let min = 0
  let max: number
  let sliderValue = [min]
  let times = []
  let sateliteImage = ''
  let clouds = []
  let cloudsToShow = []
  let viewBounds

  $: {
    if (width && isLocationSet($locationCoordinates)) {
      console.log('prefetch')
      sateliteImage = getSateliteImageUrl(
        getLocationBounds($locationCoordinates),
        width,
        YEAR
      )
    }
  }

  $: if (
    $radarOpen &&
    !($locationCoordinates.lon === 0 && $locationCoordinates.lat === 0)
  )
    reloadClouds()
  $: {
    if ($cloudData?.viewBounds?.lb && width) {
      update($cloudData)
    }
  }
  $: {
    const selectedTime = times[sliderValue[0]]
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
</script>

<ModalBackground hidden={!$radarOpen} click={() => ($radarOpen = false)} />
<div
  class="fixed flex flex-col shadow-md rounded-md pb-5 bg-white dark:bg-dark-600 p-2 left-0 right-0 top-0 z-20 transition duration-500"
  class:away={!$radarOpen}
>
  <div
    class="text-size-xl pt-2 pb-4 text-center"
    on:click={() => ($radarOpen = false)}
  >
    <span>Regenradar</span>
    <span
      class="absolute right-1 text-lg font-extralight px-3 cursor-pointer"
      role="button"
      on:click={() => ($radarOpen = false)}>×</span
    >
  </div>
  <div class="relative" bind:clientWidth={width}>
    <img
      class="sharpen1 rounded-md"
      src={sateliteImage}
      alt=""
      {width}
      aria-hidden="true"
    />
    <img
      class="sharpen2 rounded-md"
      src={sateliteImage}
      alt=""
      {width}
      aria-hidden="true"
    />
    <img src={sateliteImage} class="rounded-md" alt="" {width} />
    <RadarCanvas clouds={cloudsToShow} {viewBounds} />
  </div>
  <div class="controls z-50 mt-5 mb-10 space-y-3">
    <div
      class="text-center w-full font-light text-xl tabular-nums"
    >
      {displayTime(times[sliderValue[0]])}
    </div>
    <div class="flex">
      <button
        class="button"
        on:click={() => (sliderValue[0] = Math.max(0, sliderValue[0] - 1))}
        aria-label="Go Back"
      >
        <SvgIcon
          d={mdiSkipPrevious}
          dim={{ w: 24, h: 24 }}
          fill={getForegroundColor($darkMode)}
        />
      </button>
      <span class="w-full mx-5 mt-0.5"
        ><Slider bind:value={sliderValue} {min} {max} /></span
      >
      <button
        class="button"
        on:click={() => (sliderValue[0] = Math.min(max, sliderValue[0] + 1))}
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
  <div class="source text-center">
    <a href="https://www.bkg.bund.de">{QUELLENVERMERK}</a>
  </div>
</div>

<style>
  .sharpen1 {
    position: absolute;
    mix-blend-mode: multiply;
    filter: contrast(1.5);
    z-index: 1;
  }
  .sharpen2 {
    position: absolute;
    filter: blur(2px) invert(1) contrast(1.2);
    mix-blend-mode: overlay;
  }

  .source a {
    @apply text-xs no-underline font-normal text-gray-700 hover:underline;
    letter-spacing: -0.07em;
  }
  .dark .source a {
    @apply text-gray-400;
  }
  .away {
    @apply transform -translate-y-3/2;
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
</style>
