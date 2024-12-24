<script lang="ts">
  import { type CustomElement } from '@/logic/svelte.svelte'
  import ModalBackground from '@/components/common/ModalBackground.svelte'
  import { scale } from 'svelte/transition'
  import { backOut } from 'svelte/easing'
  import SvgIcon from '../icons/SvgIcon.svelte'
  import { closeIcon } from '../icons/icons'

  interface Props extends CustomElement {
    opened: boolean
    onclose?: () => void
    children: any
  }

  let {
    opened = $bindable(false),
    onclose,
    className = '',
    children,
    ...other
  }: Props = $props()

  function handleKeydown(event) {
    if (event.key == 'Escape') opened = false
  }
</script>

<svelte:window on:keydown={handleKeydown} />
<ModalBackground bind:show={opened} {onclose} ...other />
{#if opened}
  <div
    in:scale={{ duration: 150, easing: backOut }}
    class="pointer-events-none fixed inset-0 z-99 flex justify-center"
  >
    <div
      class="pointer-events-auto relative mx-5 mt-8 h-fit min-w-20 max-w-md rounded-default bg-surface-500 dark:bg-surface-100"
    >
      <div class="max-popup-h max-popup-w overflow-y-auto">
        {@render children()}
      </div>

      <button
        class="absolute -right-6 -top-6 size-10 rounded-full bg-surface-500 font-bold dark:bg-surface-100"
        onclick={() => {
          opened = false
        }}
      >
        <SvgIcon outline d={closeIcon}></SvgIcon>
      </button>
    </div>
  </div>
{/if}

<style>
  .max-popup-h {
    max-height: calc(100dvh - 10rem) !important;
  }
  .max-popup-w {
    max-width: calc(100dvw);
  }
</style>
