<script lang="ts">
  import { getClouds } from '../logic/radar/clouds'

  import { onMount, tick } from 'svelte'
  import { drawClouds, drawLocation, initCanvas } from '../logic/radar/draw'

  import { getLocationBounds, getSateliteImageUrl } from '../logic/radar/radar'

  let width
  let canvas
  let ctx
  const year = 2019
  const quellenvermerk = `© Europäische Union, enthält Copernicus Sentinel-2 Daten ${year}, verarbeitet durch das
Bundesamt für Kartographie und Geodäsie (BKG)`

  let viewBounds = getLocationBounds(
    {
      lat: 48.707761258821925,
      lon: 11.58858638776986,
    },
    15
  )
  console.log(viewBounds)
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
</script>

<div
  class="absolute flex flex-col shadow-md rounded-md bg-white dark:bg-dark-600 p-2 left-0 right-0 top-0"
>
  <div class="text-size-2xl pb-3 text-center">Regenradar</div>
  <div class="relative" bind:clientWidth={width}>
    <img
      class="sharpen1"
      src={sateliteImage}
      alt=""
      {width}
      aria-hidden="true"
    />
    <img
      class="sharpen2"
      src={sateliteImage}
      alt=""
      {width}
      aria-hidden="true"
    />
    <img src={sateliteImage} alt="" {width} />
    <canvas
      class="absolute left-0 z-2 opacity-70"
      {width}
      height={width}
      bind:this={canvas}
    />
  </div>
  <div class="controls" />
  <div class="source">
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
</style>
