<script lang="ts">
  import { type CustomElement } from '@/logic/svelte.svelte'
  import { cn } from '@/logic/utils'

  interface Props extends CustomElement {
    radius?: number

    strokeWidth?: number
    extraLength?: number
    color?: string
  }

  let {
    radius = 6,
    color = 'currentColor',
    strokeWidth = 2,
    extraLength = 4,
    class: className,
    ...other
  }: Props = $props()
  let widthOffset = $derived(strokeWidth / 2)
  let dimension = $derived(radius + extraLength + Math.ceil(widthOffset))
  let d = $derived(
    `M${1},${widthOffset}h${extraLength}q${radius - widthOffset},${0} ${radius - widthOffset},${radius - widthOffset}v${extraLength}`,
  )
</script>

<div
  class={cn(
    'pointer-events-none absolute h-full w-full opacity-30 group-hover:opacity-100',
    className,
  )}
  {...other}
>
  <svg
    width={`${dimension}px`}
    height={`${dimension}px`}
    stroke-linejoin="round"
    stroke-linecap="round"
    viewBox={`0 0 ${dimension} ${dimension}`}
    stroke-width={strokeWidth}
    stroke={color}
    fill="none"
    class="absolute top-0 left-0"
  >
    <path transform={`rotate(-90 ${dimension / 2} ${dimension / 2})`} {d} />
  </svg>
  <svg
    width={`${dimension}px`}
    height={`${dimension}px`}
    stroke-linejoin="round"
    stroke-linecap="round"
    viewBox={`0 0 ${dimension} ${dimension}`}
    stroke-width={strokeWidth}
    stroke={color}
    fill="none"
    class="absolute top-0 right-0"
  >
    <path transform={`rotate(0 ${dimension / 2} ${dimension / 2})`} {d} />
  </svg>
  <svg
    width={`${dimension}px`}
    height={`${dimension}px`}
    stroke-linejoin="round"
    stroke-linecap="round"
    viewBox={`0 0 ${dimension} ${dimension}`}
    stroke-width={strokeWidth}
    stroke={color}
    fill="none"
    class="absolute right-0 bottom-0"
  >
    <path transform={`rotate(90 ${dimension / 2} ${dimension / 2})`} {d} />
  </svg>
  <svg
    width={`${dimension}px`}
    height={`${dimension}px`}
    stroke-linejoin="round"
    stroke-linecap="round"
    viewBox={`0 0 ${dimension} ${dimension}`}
    stroke-width={strokeWidth}
    stroke={color}
    fill="none"
    class="absolute bottom-0 left-0"
  >
    <path transform={`rotate(180 ${dimension / 2} ${dimension / 2})`} {d} />
  </svg>
</div>
