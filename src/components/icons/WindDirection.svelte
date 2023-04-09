<svelte:options immutable />

<script lang="ts">
  import { clamp } from '../../logic/utils'
  import { windDirection } from './icons'
  import SvgIcon from './SvgIcon.svelte'
  export let direction = 0
  export let strength = 0

  let scale = 1
  $: {
    scale = 0.8 + clamp(strength / 20, 0, 1.7)
  }
</script>

<div
  class="{$$props.class || ''} outlined-path origin-center"
  style="transform: scale({scale}) rotate({direction + 90}deg)"
>
  <SvgIcon d={windDirection} outline />
</div>

<style global>
</style>
