<script lang="ts">
  import { windDirection } from './icons'
  import SvgIcon from './SvgIcon.svelte'
  export let direction = 0
</script>

<div class="flex h-max" style="transform: rotate({direction}deg); transform-origin: center;">
  <SvgIcon d={windDirection}/>
</div>
