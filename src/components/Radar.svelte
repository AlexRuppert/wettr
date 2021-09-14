<script lang="ts">
  import { getClouds } from '../logic/radar/clouds'

  import { onMount, tick } from 'svelte'
  import { drawClouds, drawLocation, initCanvas } from '../logic/radar/draw'
  import { getLocationBounds, getSateliteImageUrl } from '../logic/radar/radar'
  import Slider from '@bulatdashiev/svelte-slider'
  import ModalBackground from './ModalBackground.svelte'

  let visible = true
  let times = [
    '2021-09-13T20:00:00.000Z',
    '2021-09-13T20:15:00.000Z',
    '2021-09-13T20:30:00.000Z',
    '2021-09-13T20:45:00.000Z',
    '2021-09-13T21:00:00.000Z',
  ].map(e => new Date(e))
  let min = 0
  let value = [min]
  let max
  $: {
    max = times.length - 1
  }
  let width
  let canvas
  let ctx
  const year = 2019
  const quellenvermerk = `© Europäische Union, enthält Copernicus Sentinel-2 Daten ${year}, verarbeitet durch das
Bundesamt für Kartographie und Geodäsie (BKG)`

  let viewBounds = getLocationBounds(
    {
      lat: 51.707761258821925,
      lon: 10.58858638776986,
    },
    25
  )

  let sateliteImage
  onMount(async () => {
    ctx = initCanvas(canvas)
    await tick()
    await tick()

    sateliteImage = getSateliteImageUrl(viewBounds, width, year)
    drawLocation(ctx)
    const clouds = await getClouds(viewBounds, true)
    const times = [...new Set(clouds.map(c => c.time))]
    times.sort()
    console.log(times[0])
    const cloudsToDraw = clouds.filter(c => c.time == times[0])
    drawClouds(cloudsToDraw, viewBounds, ctx)
  })

  $: console.log(width)

  function displayTime(time) {
    return new Intl.DateTimeFormat('default', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }).format(time)
  }
</script>

<ModalBackground hidden={!visible} click={() => (visible = false)} />
<div
  class="absolute flex flex-col shadow-md rounded-md pb-5 bg-white dark:bg-dark-600 p-2 left-0 right-0 top-0 z-20 transition duration-500"
  class:away={!visible}
>
  <div class="text-size-xl pt-2 pb-4 text-center">
    <span>Regenradar</span>
    <span
      class="absolute right-1 text-lg font-extralight px-3 cursor-pointer"
      role="button"
      on:click={() => (visible = false)}>×</span
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
    <canvas
      class="absolute left-0 z-2 opacity-70"
      {width}
      height={width}
      bind:this={canvas}
    />
  </div>
  <div class="controls z-50 mt-2 mb-15">
    <div class="text-center w-full font-light text-xl tabular-nums">
      {displayTime(times[value[0]])}
    </div>
    <Slider bind:value {min} {max} />
  </div>
  <div class="source text-center">
    <a href="https://www.bkg.bund.de">{quellenvermerk}</a>
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
    @apply transform -translate-y-2/1;
  }
  div {
    --thumb-bg: #2784ff;
    --progress-bg: #2784ff;
    --track-bg: #444444;
  }
</style>
