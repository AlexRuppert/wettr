<svelte:options immutable />

<script lang="ts">
  import { windDirection } from './icons'
  import SvgIcon from './SvgIcon.svelte'
  export let direction = 0
</script>

<div
  class="outlined-path"
  style="transform: rotate({direction+90}deg); transform-origin: center;"
>
  <SvgIcon d={windDirection} outline />
</div>

<style global>
  .outlined-path svg path {
    filter: drop-shadow(0px 0px 0.5px rgba(0, 0, 0, 0.5));
  }
</style>
