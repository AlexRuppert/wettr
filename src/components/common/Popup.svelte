<script lang="ts">
  import { classProp, type CustomElement } from '@/logic/svelte.svelte'
  import ModalBackground from '@/components/common/ModalBackground.svelte'
  import { fly, scale } from 'svelte/transition'
  import { backOut } from 'svelte/easing'

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

  function handleClose() {
    opened = false
    onclose?.()
  }
</script>

{#if opened}
  <ModalBackground show={opened} onclose={handleClose} ...other />
  <div
    in:scale={{ duration: 150, easing: backOut }}
    class="pointer-events-none fixed inset-0 z-[99] flex justify-center"
  >
    <div
      class="pointer-events-auto relative mx-5 mt-8 h-fit max-w-sm rounded-default bg-surface-500 p-3 dark:bg-surface-100"
    >
      <button
        class="absolute -right-4 -top-4 size-8 rounded-full bg-surface-500 font-bold dark:bg-surface-100"
        onclick={handleClose}
      >
        ✕
      </button>
      {@render children()}
    </div>
  </div>
{/if}

<style>
</style>
