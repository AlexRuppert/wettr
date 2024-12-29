<script lang="ts">
  import Button from '@/components/common/Button.svelte'
  import SvgIcon from '@/components/icons/SvgIcon.svelte'
  import { type CustomElement } from '@/logic/svelte.svelte'
  interface Props extends CustomElement {
    icon: string
    outline?: boolean
  }
  let {
    icon,
    outline = true,
    class: className,
    children,
    ...other
  }: Props = $props()
</script>

<Button class={['size-10', className]} {...other}>
  <SvgIcon d={icon} {outline} />
  {@render children?.()}
</Button>
