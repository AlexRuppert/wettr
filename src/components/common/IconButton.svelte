<script lang="ts">
  import SvgIcon from '../icons/SvgIcon.svelte'
  import { darkMode } from '../../stores/store'
  import { getForegroundColor } from '../../logic/utils'

  export let icon
  export let label = 'Button'
</script>

<button
  class="appearance-none bg-transparent dark:hover:bg-dark-400 dark:active:bg-dark-200 hover:bg-blue-gray-100 active:bg-blue-gray-200 rounded border-none w-10 h-10 cursor-pointer flex items-center p-1;"
  on:click
  aria-label={label}
>
  <SvgIcon
    d={icon}
    dim={{ w: 24, h: 24 }}
    fill={getForegroundColor($darkMode)}
  />
</button>

<style>
  button {
    touch-action: manipulation;
    aspect-ratio: 1;
  }
</style>
