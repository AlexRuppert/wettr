<script lang="ts">
  import ModalBackground from '@/components/common/ModalBackground.svelte'
  import { type CustomElement } from '@/logic/svelte.svelte'
  import { backOut } from 'svelte/easing'
  import { scale } from 'svelte/transition'
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
      class="bg-surface-500 dark:bg-surface-100 pointer-events-auto relative mx-5 mt-8 h-fit max-w-md min-w-20 rounded-md"
    >
      <div
        class="max-h-[calc(100dvh-10rem)] max-w-dvw overflow-y-auto rounded-md"
      >
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
