<svelte:options immutable />

<script lang="ts">
  import { windDirection } from './icons'
  import SvgIcon from './SvgIcon.svelte'
  export let direction = 0
</script>

<div
  class="outlined-path origin-center"
  style="transform: rotate({direction + 90}deg)"
>
  <SvgIcon d={windDirection} outline />
</div>

<style global>
  .outlined-path {
    --wind-drop-shadow: #fff;
    filter: drop-shadow(0 0 1px var(--wind-drop-shadow)) !important;
  }
  @media (prefers-color-scheme: dark) {
    .outlined-path {
      --wind-drop-shadow: #111;
    }
  }
</style>
