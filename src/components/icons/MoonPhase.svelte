<script lang="ts">
  import { type CustomElement } from '@/logic/svelte.svelte'
  interface Props extends CustomElement {
    timestamp?: Date
  }
  let { timestamp = new Date(), class: className }: Props = $props()

  let [l, r] = $derived(
    [
      { mul: -4, fn: Math.min },
      { mul: 4, fn: Math.max },
    ].map(({ mul, fn }) => 1 - mul * fn(0, getMoonRatio(timestamp) - 0.5)),
  )
  function getMoonRatio(timestamp: Date) {
    const LUNAR_MS = 2551442777.777664
    const KNOWN_NEW_MOON = 1641148380000 //new Date('2022-01-02T19:33+01:00').getTime()
    return ((timestamp.getTime() - KNOWN_NEW_MOON) % LUNAR_MS) / LUNAR_MS
  }
</script>

<svg
  stroke-linecap="butt"
  viewBox="-3 0 6 6"
  fill="currentColor"
  class={[className]}
>
  <path d={`M0 0c${-l * 4} 0 ${-l * 4} 6 0 6c${r * 4} 0 ${r * 4}-6 0-6`} />
</svg>
