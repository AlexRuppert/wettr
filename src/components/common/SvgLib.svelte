<script lang="ts">
  import { weatherIconPaths } from '../icons/icons'
</script>

<svg class="hidden">
  <defs>
    {#each Object.entries(weatherIconPaths) as [id, d]}
      <path {id} {d} />
    {/each}

    <path
      id="thunderstorm"
      stroke-width="0.3"
      fill="currentColor"
      d="M12.6 17h3.5l-2.5 4h1.8l-5 6.9l2-5.3h-2.5z"
    />
    <circle id="celsius-circle" stroke-width="0.7" r="1.2" />
    <path
      id="wind-indicator"
      d="M8 13h13a2.5 2.5 0 10-2-4M6 17h17a2.5 2.5 0 11-2 4"
      transform="scale(0.5 0.5)"
    />
  </defs>
</svg>
