<svelte:options immutable />

<script lang="ts">
  import { chevronDown, alertWarning } from '../icons/icons'
  import { darkMode } from '../../stores/store'
  import { getDarkLightColor, COLORS } from '../../logic/utils'
  import SvgIcon from '../icons/SvgIcon.svelte'
  export let collapsed = true
  export let title = ''
  export let suffix = ''
  export let time = ''
  export let subItem = false
</script>

<div
  class="flex space-x-1 h-14 w-full"
  on:click
  class:shadow-md={!collapsed}
  class:warning-sub-item-header={subItem}
  class:clickable={!subItem}
  class:rounded-md={!subItem}
>
  <div class="flex h-5 ml-2 w-5 self-center">
    <SvgIcon
      d={alertWarning}
      fill={!subItem
        ? getDarkLightColor(COLORS.warning, $darkMode)
        : getDarkLightColor(COLORS.foreground, $darkMode)}
    />
  </div>
  <div
    class="flex flex-grow font-semibold flex-shrink-0 self-center overflow-hidden overflow-ellipsis"
  >
    {title}
    <span class="font-light text-xs ml-1 tracking-wide tabular-nums self-center"
      >{suffix}</span
    >
  </div>
  <div
    class="flex font-light text-xs text-right self-center"
    class:pr-6={subItem}
  >
    {time}
  </div>

  {#if !subItem}
    <div
      class="p-2 pt-3 transition-transform w-8 self-center"
      class:mirrored-y={!collapsed}
    >
      <SvgIcon
        d={chevronDown}
        fill={!collapsed ? getDarkLightColor(COLORS.warning, $darkMode) : null}
        outline
      />
    </div>
  {/if}
</div>

<style global>
  .warning-sub-item-header {
    @apply bg-light-400 dark:bg-dark-500;
  }
  .mirrored-y {
    transform: scaleY(-1);
  }
</style>
