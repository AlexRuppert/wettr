<script lang="ts">
  export let timestamp = new Date()
  let l = 1
  let r = 1

  let phase = 0.8
  const LUNAR_MS = 2551442777.777664
  const KNOWN_NEW_MOON = new Date('2022-01-02T19:33+01:00').getTime()
  $: {
    const over50 = Math.max(0, phase - 0.5)
    const under50 = -Math.min(0, phase - 0.5)
    l = 1 - 4 * under50
    r = 1 - 4 * over50
  }
  $: {
    phase = getMoonRatio(timestamp)
  }

  function getMoonRatio(timestamp: Date) {
    return ((timestamp.getTime() - KNOWN_NEW_MOON) % LUNAR_MS) / LUNAR_MS
  }
</script>

<svg
  width="100%"
  height="100%"
  stroke-linecap="butt"
  stroke-linejoin="round"
  viewBox="-3 0 6 6"
  fill="currentColor"
  stroke="currentColor"
  stroke-width={l < -0.85 || r < -0.85 ? '0.1' : '0'}
>
  <path
    shape-rendering="geometricPrecision"
    d={`M0 0c${-l * 4} 0 ${-l * 4} 6 0 6c${r * 4} 0 ${r * 4}-6 0-6`}
  />
</svg>
