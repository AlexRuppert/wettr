<script lang="ts">
  import { filterClouds } from '../logic/radar/clouds'
  import type { Cloud } from '../logic/radar/clouds'
  import type { GeoBounds } from '../logic/radar/utils'
  import { getNowestTime } from '../logic/radar/utils'
  import { currentCloudData, radarOpen } from '../stores/store'
  import RadarCanvas from './RadarCanvas.svelte'

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

<div
  class="relative w-full h-full cursor-pointer"
  on:click={() => ($radarOpen = true)}
>
  <RadarCanvas clouds={cloudData} {viewBounds} circleShape={true} />
</div>
