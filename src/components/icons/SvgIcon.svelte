<svelte:options immutable />

<script lang="ts">
  import { getForegroundColor } from '../../logic/utils'
  import { darkMode } from '../../stores/store'
  export let d: string
  export let fill = null

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
    if (d) dim = d.endsWith('z') ? 30 : 24
  }
</script>

<svg viewBox="0 0 {dim} {dim}" fill={_fill} width="100%" height="100%">
  <path {d} />
</svg>
