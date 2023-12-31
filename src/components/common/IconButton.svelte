<svelte:options immutable />

<script lang="ts">
  import SvgIcon from '@/components/icons/SvgIcon.svelte'
  import Button from '@/components/common/Button.svelte'
  import { classProp, type CustomElement } from '@/logic/svelte'
  interface Props extends CustomElement {
    icon: string
    label?: string
    outline?: boolean
    strokeWidth?: number
  }
  let {
    icon,
    label = 'Button',
    outline = false,
    strokeWidth = 1,
    className = '',
    ...other
  } = $props<Props>()
</script>

<Button {className} {label} {...other}>
  <SvgIcon d={icon} {outline} {strokeWidth} />
</Button>
