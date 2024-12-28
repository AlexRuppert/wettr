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
      class="rounded-default bg-surface-500 dark:bg-surface-100 pointer-events-auto relative mx-5 mt-8 h-fit max-w-md min-w-20"
    >
      <div class="max-popup-h max-popup-w overflow-y-auto">
        {@render children()}
      </div>

      <button
        class="bg-surface-500 dark:bg-surface-100 absolute -top-6 -right-6 size-10 rounded-full font-bold"
        onclick={() => {
          opened = false
        }}
      >
        <SvgIcon d={closeIcon}></SvgIcon>
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
