<script lang="ts">
  import { alertWarning } from '@/components/icons/icons'
  import SvgIcon from '@/components/icons/SvgIcon.svelte'

  import { classProp, type CustomElement } from '@/logic/svelte.svelte'
  import SvgCorner from '../icons/SvgCorner.svelte'

  interface Props extends CustomElement {
    title?: string
    suffix?: string
    time?: string
    subItem?: boolean
  }
  let {
    title = '',
    suffix = '',
    time = '',
    subItem = false,
    className,
    ...other
  }: Props = $props()
</script>

<div
  class={classProp('relative flex h-14 w-full space-x-1 pr-3', className)}
  role="button"
  tabindex="0"
  class:bg-surface-500={subItem}
  class:clickable={!subItem}
  class:rounded-md={!subItem}
  {...other}
>
  {#if !subItem}
    <SvgCorner className="text-warning"></SvgCorner>
  {/if}

  <div
    class="ml-2 flex h-5 w-5 shrink-0 self-center text-text-soft"
    class:text-warning={!subItem}
  >
    <SvgIcon d={alertWarning} />
  </div>
  <div
    class="flex grow self-center overflow-hidden text-ellipsis font-semibold"
  >
    {title}
    <span class="ml-1 self-center text-xs font-light tabular-nums tracking-wide"
      >{suffix}</span
    >
  </div>
  <div
    class="flex self-center text-right text-xs font-light"
    class:pr-6={subItem}
  >
    {time}
  </div>
</div>
