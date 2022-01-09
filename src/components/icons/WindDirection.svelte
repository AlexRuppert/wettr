<svelte:options immutable />

<script lang="ts">
  import { windDirection } from './icons'
  import SvgIcon from './SvgIcon.svelte'
  export let direction = 0
  export let color: string = undefined
</script>

<div
  class="outlined-path"
  style="transform: rotate({direction}deg); transform-origin: center;"
>
  <SvgIcon d={windDirection} fill={color} />
</div>

<style>
  :global(.outlined-path svg path) {
    filter: drop-shadow(0px 0px 0.5px rgba(0, 0, 0, 0.5));
  }
</style>
