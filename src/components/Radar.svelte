<script lang="ts">
  import { radarOpen, cloudData, locationCoordinates } from '../stores/store'

  import { onMount, tick } from 'svelte'
  import { getSateliteImageUrl } from '../logic/radar/radar'
  import { reloadClouds } from '../logic/reloader'
  import { filterClouds } from '../logic/radar/clouds'
  import Slider from '@bulatdashiev/svelte-slider'
  import ModalBackground from './ModalBackground.svelte'
  import RadarCanvas from './RadarCanvas.svelte'

  const YEAR = 2019
  const QUELLENVERMERK = `© Europäische Union, enthält Copernicus Sentinel-2 Daten ${YEAR}, verarbeitet durch das
Bundesamt für Kartographie und Geodäsie (BKG)`

  let width
  let min = 0
  let max
  let sliderValue = [min]
  let times = []
  let sateliteImage = ''
  let clouds = []
  let cloudsToShow = []
  let viewBounds

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
    sateliteImage = getSateliteImageUrl(cloudData.viewBounds, width, YEAR)
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
  class="absolute flex flex-col shadow-md rounded-md pb-5 bg-white dark:bg-dark-600 p-2 left-0 right-0 top-0 z-20 transition duration-500"
  class:away={!$radarOpen}
>
  <div class="text-size-xl pt-2 pb-4 text-center">
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
  <div class="controls z-50 mt-2 mb-15">
    <div class="text-center w-full font-light text-xl tabular-nums">
      {displayTime(times[sliderValue[0]])}
    </div>
    <Slider bind:value={sliderValue} {min} {max} />
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
    @apply no-underline font-normal text-gray-700 hover:underline;
  }
  .dark .source a {
    @apply text-gray-400;
  }
  .away {
    @apply transform -translate-y-1/1;
  }
  div {
    --thumb-bg: #2784ff;
    --progress-bg: #2784ff;
    --track-bg: #444444;
  }
</style>
