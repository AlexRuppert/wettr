<svelte:options immutable />

<script lang="ts">
  export let top: string
  export let bottom: string
</script>

<div class="self-center pt-0.5 text-[0.6rem]">
  <sup>{top}</sup>/<sub>{bottom}</sub>
</div>
