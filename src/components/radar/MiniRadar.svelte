<svelte:options immutable />

<script lang="ts">
  import { filterClouds } from '../../logic/radar/clouds'
  import type { Cloud } from '../../logic/radar/clouds'
  import type { GeoBounds } from '../../logic/radar/utils'
  import { getNowestTime } from '../../logic/radar/utils'
  import { currentCloudData, radarOpen } from '../../stores/store'
  import RadarCanvas from './RadarCanvas.svelte'
  import { fade } from 'svelte/transition'

  let cloudData: Cloud[]
  let viewBounds: GeoBounds
  $: {
    if ($currentCloudData.times.length > 0) {
      viewBounds = $currentCloudData.viewBounds
      cloudData = filterClouds(
        $currentCloudData.clouds,
        getNowestTime($currentCloudData.times).time
      )
    }
  }
</script>

<div class="rounded-md h-full w-full relative clickable" transition:fade>
  <RadarCanvas clouds={cloudData} {viewBounds} mini={true} />
</div>
