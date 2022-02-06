<svelte:options immutable />

<script lang="ts">
  import { getForegroundColor } from '../../logic/utils'
  import { darkMode } from '../../stores/store'
  export let d: string
  export let fill = null
  export let outline = false
  export let strokeWidth = 1.5

  let defaultColor = '#444'
  darkMode.subscribe(value => {
    defaultColor = getForegroundColor(value)
  })
  let _fill = defaultColor

  $: {
    _fill = fill ?? defaultColor
  }
  let dim = 5
  $: {
    //cheap way to get the dimensions, as there are only 2 icon sets
    if (d) dim = outline || d.endsWith('z') ? 30 : 24
  }
</script>

<svg
  viewBox="0 0 {dim} {dim}"
  fill={!outline ? _fill : 'none'}
  width="100%"
  height="100%"
  stroke={outline ? _fill : 'none'}
  stroke-linejoin="round"
  stroke-linecap="round"
  stroke-width={strokeWidth}
>
  <path {d} />
</svg>

<style global>
</style>
