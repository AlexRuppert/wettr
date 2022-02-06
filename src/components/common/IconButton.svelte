<script lang="ts">
  import SvgIcon from '../icons/SvgIcon.svelte'
  import Button from './Button.svelte'

  export let icon
  export let label = 'Button'
  export let outline = false
  export let strokeWidth = 1.5
</script>

<Button on:click {label}>
  <SvgIcon d={icon} {outline} {strokeWidth}/>
</Button>

<style global>
</style>
