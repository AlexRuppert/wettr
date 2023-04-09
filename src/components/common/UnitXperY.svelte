<svelte:options immutable />

<script lang="ts">
  export let top: string
  export let bottom: string
</script>

<div class="pt-1 self-center">
  <sup>{top}</sup>/<sub>{bottom}</sub>
</div>

<style>
  div {
    font-size: 0.6rem;
  }
</style>
