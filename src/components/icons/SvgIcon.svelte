<svelte:options immutable />

<script lang="ts">
  export let d: string
  export let fill = null
  export let outline = false
  export let strokeWidth = 1.5

  let _fill

  $: {
    _fill = fill ?? 'currentColor'
  }
</script>

<svg
  width="100%"
  height="100%"
  stroke-linejoin="round"
  stroke-linecap="round"
  viewBox="0 0 30 30"
  fill={!outline ? _fill : 'none'}
  stroke={outline ? _fill : 'none'}
  stroke-width={strokeWidth}
>
  <path {d} />
</svg>

<style global>
</style>
