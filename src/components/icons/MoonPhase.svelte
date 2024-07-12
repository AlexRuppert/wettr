<script lang="ts">
  interface Props {
    timestamp?: Date
  }
  let { timestamp = new Date() }: Props = $props()

  let phase = $derived(getMoonRatio(timestamp) - 0.5)
  let [l, r] = $derived(
    [
      { mul: -4, fn: Math.min },
      { mul: 4, fn: Math.max },
    ].map(({ mul, fn }) => 1 - mul * fn(0, phase)),
  )
  function getMoonRatio(timestamp: Date) {
    const LUNAR_MS = 2551442777.777664
    const KNOWN_NEW_MOON = new Date('2022-01-02T19:33+01:00').getTime()
    return ((timestamp.getTime() - KNOWN_NEW_MOON) % LUNAR_MS) / LUNAR_MS
  }
</script>

<svg
  width="100%"
  height="100%"
  stroke-linecap="butt"
  viewBox="-3 0 6 6"
  fill="currentColor"
  stroke="currentColor"
  stroke-width={l < -0.85 || r < -0.85 ? '0.1' : '0'}
>
  <path d={`M0 0c${-l * 4} 0 ${-l * 4} 6 0 6c${r * 4} 0 ${r * 4}-6 0-6`} />
</svg>
