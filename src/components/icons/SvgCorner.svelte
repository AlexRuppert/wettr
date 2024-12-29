<script lang="ts">
  import { type CustomElement } from '@/logic/svelte.svelte'

  interface Props extends CustomElement {
    radius?: number
    strokeWidth?: number
    extraLength?: number
  }

  let {
    radius = 6,
    strokeWidth = 2,
    extraLength = 4,
    class: className,
  }: Props = $props()
  let widthOffset = $derived(strokeWidth / 2)
  let dimension = $derived(radius + extraLength + Math.ceil(widthOffset))
  let d = $derived(
    `M${1},${widthOffset}h${extraLength}q${radius - widthOffset},${0} ${radius - widthOffset},${radius - widthOffset}v${extraLength}`,
  )

  const corners = [
    'top-0 left-0',
    'top-0 right-0',
    'bottom-0 right-0',
    'bottom-0 left-0',
  ]
</script>

{#snippet corner(dimension, strokeWidth, rotate, cls)}
  <svg
    stroke-linejoin="round"
    stroke-linecap="round"
    width={dimension}
    height={dimension}
    stroke-width={strokeWidth}
    stroke="currentColor"
    fill="none"
    class={'pointer-events-none absolute opacity-30 ' + cls}
  >
    <path
      transform={`rotate(${rotate} ${dimension / 2} ${dimension / 2})`}
      {d}
    />
  </svg>
{/snippet}

{#each corners as cls, i}
  {@render corner(dimension, strokeWidth, -90 + i * 90, cls + ' ' + className)}
{/each}
