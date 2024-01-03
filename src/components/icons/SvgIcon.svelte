<svelte:options immutable />

<script lang="ts">
  import { classProp, type CustomElement } from '@/logic/svelte.svelte'
  interface Props extends CustomElement {
    d: string
    fill?: string
    outline?: boolean
    strokeWidth?: number
  }

  let {
    d,
    fill,
    outline = false,
    strokeWidth = 1,
    className,
    ...other
  } = $props<Props>()

  let { svgStroke, svgFill } = $derived(getStrokeFill(fill))

  function getStrokeFill(fill: Props['fill']) {
    let _fill = fill ?? 'currentColor'
    if (outline) {
      return { svgStroke: _fill, svgFill: 'none' }
    } else {
      return { svgStroke: 'none', svgFill: _fill }
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
  class={className}
  {...other}
>
  <path {d} />
</svg>
