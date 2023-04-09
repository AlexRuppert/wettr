<svelte:options immutable />

<script lang="ts">
  import SvgIcon from '../icons/SvgIcon.svelte'
  import Button from './Button.svelte'

  export let icon: string
  export let label = 'Button'
  export let outline = false
  export let strokeWidth = 1
</script>

<Button class={$$props.class || ''} on:click {label}>
  <SvgIcon d={icon} {outline} {strokeWidth} />
</Button>
