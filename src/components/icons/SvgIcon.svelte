<svelte:options immutable />

<script lang="ts">
  export let d: string
  export let fill: string | null = null
  export let outline = false
  export let strokeWidth = 1

  let svgStroke: string
  let svgFill: string
  $: {
    let _fill = fill ?? 'currentColor'

    if (outline) {
      svgStroke = _fill
      svgFill = 'none'
    } else {
      svgStroke = 'none'
      svgFill = _fill
    }
  }
</script>

<svg
  width="100%"
  height="100%"
  viewBox="0 0 30 30"
  stroke-linejoin="round"
  stroke-linecap="round"
  stroke-width={strokeWidth}
  stroke={svgStroke}
  fill={svgFill}
  class={$$props.class || ''}
>
  <path {d} />
</svg>
