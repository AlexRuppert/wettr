<script lang="ts">
  import SvgIcon from '../icons/SvgIcon.svelte'
  import Button from './Button.svelte'

  export let icon
  export let label = 'Button'
</script>

<Button on:click {label}>
  <SvgIcon d={icon} />
</Button>
