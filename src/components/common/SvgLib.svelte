<script lang="ts">
  const paths = $state({
    sun: 'M15 10.5a4.5 4.5 0 10.001 0',
    'sun-rays':
      'M15 5v2m0 18v-2M5 15h2m18 0h-2M7.75 7.75l1.4 1.4m13.1 13.1l-1.4-1.4m1.4-13.1l-1.4 1.4m-13.1 13.1l1.4-1.4',
    'cloud-open': 'M7 20a4 4 0 110-8h1a4 4 0 1110-0h1.5a4 4 0 110 8',
    cloud: 'M7 20a4 4 0 110-8h1a4 4 0 1110-0h1.5a4 4 0 110 8z',
    'sun-part': 'M18 7a3.8 3.8 0 116 4.5',
    'sun-part-rays':
      'M21.5 1.2l0 1.5M27.5 8.8l1.5 0M25.8 4.6l1.1-1.1M17 4.6l-1.1-1.1M25.8 13l1.1 1.1',
    'cloud-part': 'M18.2 7.1a4 4 0 016.7 2.9h1a3.1 3 0 010 6.4h-0.2',
    fog: 'M8 13h15M10 16h16M6 19h16',
    wind: 'M8 12h13a2.5 2.5 0 10-2-4M10 14h10.5q4 0 4-2M6 16h17a2.5 2.5 0 11-2 4',
    rain: 'M10 20l-1 5M13.3 20l-1.4 7M16.5 20l-.8 4.2',
    sleet:
      'M10 20l-.03.15m-.4 2l-.4 2M13.3 20l-.4 2m-.4 2l-.03.15m-.4 2l-.03.15M16.5 20l-.03.25m-.4 2l-.4 2',
    snow: 'M10.5 21.5l0 0m0 3l0 0M13.3 20l0 0m0 3l0 0m0 3l0 0M16 21.5l0 0m0 3l0 0',
    hail: 'M10 20l-.4 2m-.4 2l-.03.15M13.3 20l-.8 4m-.4 2l-.03.15M16.5 20l-.4 2m-.4 2l-.03.15',
  })
</script>

<svg class="hidden">
  <defs>
    {#each Object.entries(paths) as [id, d]}
      <path {id} {d} vector-effect="non-scaling-stroke" />
    {/each}

    <path
      id="thunderstorm"
      stroke-width="0.3"
      fill="currentColor"
      d="M12.6 17h3.5l-2.5 4h1.8l-5 6.9l2-5.3h-2.5z"
      vector-effect="non-scaling-stroke"
    />
    <circle id="celsius-circle" stroke-width="0.7" r="1.2" />
    <path
      id="wind-indicator"
      d="M8 13h13a2.5 2.5 0 10-2-4M6 16h17a2.5 2.5 0 11-2 4"
      transform="scale(0.5 0.5)"
      vector-effect="non-scaling-stroke"
    />
  </defs>
</svg>
