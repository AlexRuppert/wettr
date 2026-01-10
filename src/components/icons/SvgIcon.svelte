<script lang="ts">
  import { type CustomElement } from '@/logic/svelte.svelte'
  import { getStrokeFill } from '@/logic/utils'
  interface Props extends CustomElement {
    d: string
    outline?: boolean
    strokeWidth?: number
  }

  let { d, outline = true, strokeWidth = 1, ...other }: Props = $props()
</script>

<svg
  stroke-linejoin="round"
  stroke-linecap="round"
  width="100%"
  height="100%"
  viewBox="0 0 30 30"
  stroke-width={strokeWidth}
  {...getStrokeFill(outline)}
  {...other}
>
  <path {d} />
</svg>
