<svelte:options immutable />

<script lang="ts">
  import { chevronDown, alertWarning } from '../icons/icons'
  import SvgIcon from '../icons/SvgIcon.svelte'
  export let collapsed = true
  export let title = ''
  export let suffix = ''
  export let time = ''
  export let subItem = false
</script>

<div
  class="flex h-14 w-full space-x-1"
  on:click
  role="button"
  tabindex="0"
  class:shadow-md={!collapsed}
  class:bg-surface-500={subItem}
  class:clickable={!subItem}
  class:rounded-md={!subItem}
>
  <div
    class="ml-2 flex h-5 w-5 self-center text-text-soft"
    class:text-warning={!subItem}
  >
    <SvgIcon d={alertWarning} />
  </div>
  <div
    class="flex flex-shrink-0 flex-grow self-center overflow-hidden overflow-ellipsis font-semibold"
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
