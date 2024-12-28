<script lang="ts">
  import Button from '@/components/common/Button.svelte'
  import SvgIcon from '@/components/icons/SvgIcon.svelte'
  import { type CustomElement } from '@/logic/svelte.svelte'
  import { cn } from '@/logic/utils'
  interface Props extends CustomElement {
    icon: string
    label?: string
    outline?: boolean
    strokeWidth?: number
  }
  let {
    icon,
    label = 'Button',
    outline = true,
    strokeWidth = 1,
    class: className,
    ...other
  }: Props = $props()
</script>

<Button class={cn('size-10', className)} {label} {...other}>
  <SvgIcon d={icon} {outline} {strokeWidth} />
</Button>
