<script lang="ts">
  import SvgIcon from '@/components/icons/SvgIcon.svelte'
  import Button from '@/components/common/Button.svelte'
  import { classProp, type CustomElement } from '@/logic/svelte.svelte'
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
  }: Props = $props()
</script>

<Button {className} {label} {...other}>
  <SvgIcon d={icon} {outline} {strokeWidth} />
</Button>
