<script lang="ts">
  import { alertWarning } from '@/components/icons/icons'
  import SvgIcon from '@/components/icons/SvgIcon.svelte'

  import { type CustomElement } from '@/logic/svelte.svelte'
  import { cn } from '@/logic/utils'
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
    class: className,
    ...other
  }: Props = $props()
</script>

<div
  class={cn('relative flex h-14 w-full space-x-1 pr-3', className, {
    'bg-surface-500': subItem,
    'clickable rounded-md': !subItem,
  })}
  role="button"
  tabindex="0"
  {...other}
>
  {#if !subItem}
    <SvgCorner class="text-warning"></SvgCorner>
  {/if}

  <div
    class={cn('text-text-soft ml-2 flex h-5 w-5 shrink-0 self-center', {
      'text-warning': !subItem,
    })}
  >
    <SvgIcon d={alertWarning} />
  </div>
  <div
    class="flex grow self-center overflow-hidden font-semibold text-ellipsis"
  >
    {title}
    <span class="ml-1 self-center text-xs font-light tracking-wide tabular-nums"
      >{suffix}</span
    >
  </div>
  <div
    class={cn('flex self-center text-right text-xs font-light', {
      'pr-6': subItem,
    })}
  >
    {time}
  </div>
</div>
