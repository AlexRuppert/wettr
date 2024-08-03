<script lang="ts">
  import { chevronDown, alertWarning } from '@/components/icons/icons'
  import SvgIcon from '@/components/icons/SvgIcon.svelte'

  import { classProp, type CustomElement } from '@/logic/svelte.svelte'
  import SvgCorner from '../icons/SvgCorner.svelte'

  interface Props extends CustomElement {
    collapsed?: boolean
    title?: string
    suffix?: string
    time?: string
    subItem?: boolean
  }
  let {
    collapsed = true,
    title = '',
    suffix = '',
    time = '',
    subItem = false,
    className,
    ...other
  }: Props = $props()
</script>

<div
  class={classProp('relative flex h-14 w-full space-x-1', className)}
  role="button"
  tabindex="0"
  class:shadow-md={!collapsed}
  class:bg-surface-500={subItem}
  class:clickable={!subItem}
  class:rounded-md={!subItem}
  {...other}
>
  {#if !subItem}
    <SvgCorner></SvgCorner>
  {/if}

  <div
    class="ml-2 flex h-5 w-5 flex-shrink-0 self-center text-text-soft"
    class:text-warning={!subItem}
  >
    <SvgIcon d={alertWarning} />
  </div>
  <div
    class="flex flex-grow self-center overflow-hidden overflow-ellipsis font-semibold"
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

  {#if !subItem}
    <div
      class="-scale-y- w-8 origin-center self-center p-2 pt-3 transition-transform"
      class:-scale-y-100={!collapsed}
      class:text-warning={!collapsed}
    >
      <SvgIcon d={chevronDown} outline />
    </div>
  {/if}
</div>
