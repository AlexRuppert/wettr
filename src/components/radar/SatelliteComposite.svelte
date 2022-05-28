<svelte:options immutable />

<script lang="ts">
  import { fade } from 'svelte/transition'

  import { getCachedRequest } from './../../logic/cache'

  import { isLocationSet } from './../../logic/locations'
  import { getLocationBounds } from './../../logic/radar/utils'
  import { locationCoordinates } from './../../stores/store'

  import RadarCanvas from './RadarCanvas.svelte'

  export let clouds
  export let viewBounds
  let satelliteImage

  const WIDTH = 350
  const YEAR = 2019

  function getSatelliteImageUrl(viewBounds, width, year = 2019) {
    const bbox = [
      viewBounds.lb.lat,
      viewBounds.lb.lon,
      viewBounds.rt.lat,
      viewBounds.rt.lon,
    ]
      .map(num => Number.parseFloat(num).toFixed(3))
      .join(',')

    return `https://sgx.geodatenzentrum.de/wms_topplus_open?service=wms&version=1.3.0&request=GetMap&Layers=web&STYLES=default&BBOX=${bbox}&CRS=EPSG:4326&width=${
      width * 1.5
    }&Height=${width * 1.5}&Format=image/jpeg`
  }

  $: (async () => {
    if (isLocationSet($locationCoordinates)) {
      const satelliteImageUrl = getSatelliteImageUrl(
        getLocationBounds($locationCoordinates),
        WIDTH,
        YEAR
      )
      //const blob = await (await getCachedRequest(satelliteImageUrl)).blob()
      satelliteImage = satelliteImageUrl//URL.createObjectURL(blob)
    }
  })()
</script>

<div
  class="relative children:(w-full rounded-md) "
  style={`min-height:${WIDTH - 22}px`}
>
  {#if satelliteImage}
    <img class="sharpen2" src={satelliteImage} alt="" aria-hidden="true" />
    <img src={satelliteImage} alt="" transition:fade={{ duration: 150 }} />
  {/if}
  <RadarCanvas {clouds} {viewBounds} />
</div>

<style global>
  .sharpen2 {
    position: absolute;
    filter: blur(1px) invert(1) contrast(2);
    mix-blend-mode: overlay;
  }
</style>
