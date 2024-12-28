<script lang="ts">
  import Button from '@/components/common/Button.svelte'
  import SvgIcon from '@/components/icons/SvgIcon.svelte'
  import { type CustomElement } from '@/logic/svelte.svelte'
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
    ...other
  }: Props = $props()
</script>

<Button {label} {...other}>
  <SvgIcon d={icon} {outline} {strokeWidth} />
</Button>
