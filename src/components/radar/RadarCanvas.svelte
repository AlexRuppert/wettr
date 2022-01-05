<svelte:options immutable />
<script lang="ts">
  import {
    drawClouds,
    drawEnv,
    drawLocation,
    initCanvas,
  } from '../../logic/radar/draw'
  import { onMount, tick } from 'svelte'
  import { getDarkLightColor, COLORS } from '../../logic/utils'
  import { darkMode } from '../../stores/store'
  let width
  let canvas
  let ctx
  let mounted = false
  export let clouds
  export let viewBounds
  export let mini = false

  $: {
    $darkMode
    if (clouds && viewBounds?.lb) {
      if (mounted) {
        update(clouds, viewBounds)
      } else {
        setTimeout(() => {
          update(clouds, viewBounds)
        }, 1000 * 2)
      }
    }
  }

  onMount(async () => {
    await tick()
    mounted = true
    ctx = initCanvas(canvas, width)
    drawEnv(ctx)

    drawDot()
  })

  function drawDot() {
    drawLocation(
      ctx,
      mini ? 'transparent' : '#a30',
      getDarkLightColor(COLORS.sun, $darkMode),
      6
    )
  }

  async function update(clouds, viewBounds) {
    drawClouds(clouds, viewBounds, ctx, mini)
    drawDot()
  }
</script>

<canvas
  class="absolute inset-0 w-full h-full opacity-70 z-10"
  bind:clientWidth={width}
  bind:this={canvas}
/>
