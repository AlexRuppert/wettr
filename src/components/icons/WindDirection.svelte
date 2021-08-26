<script lang="ts">
  import { windDirection } from './icons'
  import SvgIcon from './SvgIcon.svelte'
  export let direction = 0
  export let color: string = undefined
</script>

<div
  style="transform: rotate({direction}deg); transform-origin: center;"
>
  <SvgIcon d={windDirection} fill={color}/>
</div>
