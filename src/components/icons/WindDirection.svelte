<svelte:options immutable />

<script lang="ts">
  import { windDirection } from './icons'
  import SvgIcon from './SvgIcon.svelte'
  export let direction = 0
</script>

<div
  class="outlined-path"
  style="transform: rotate({direction + 90}deg); transform-origin: center;"
>
  <SvgIcon d={windDirection} outline />
</div>

<style global>
  .outlined-path {
    filter: drop-shadow(0 0 1px #fff) !important;
  }
  @media (prefers-color-scheme: dark) {
    .outlined-path {
      filter: drop-shadow(0 0 1px #111) !important;
    }
  }
</style>
