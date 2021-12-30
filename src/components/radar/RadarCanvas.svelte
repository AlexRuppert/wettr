<script lang="ts">
  import { drawClouds, drawLocation, initCanvas } from '../../logic/radar/draw'
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
    if (clouds?.length && viewBounds?.lb) {
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
  })

  async function update(clouds, viewBounds) {
    drawClouds(clouds, viewBounds, ctx, mini)
    drawLocation(ctx, getDarkLightColor(COLORS.sun, $darkMode), 6)
  }
</script>

<canvas
  class="absolute inset-0 w-full h-full opacity-70 z-1"
  bind:clientWidth={width}
  bind:this={canvas}
/>
