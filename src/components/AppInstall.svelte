<script lang="ts">
  import SvgIcon from '@/components/icons/SvgIcon.svelte'
  import { addBox, shareIcon } from '@/components/icons/icons'
  import { scale } from 'svelte/transition'
  import Button from './common/Button.svelte'
  let isIos = /iPad|iPhone|iPod/.test(navigator.userAgent)
  let showInstallButton = $state(false)
  let showInstallOverlay = $state(false)
  let alreadyInstalled = $state(false)
  let deferredInstallPrompt
  const iOSCanInstall = 'standalone' in window.navigator
  const iOSIsInstalled = window.navigator['standalone'] === true

  window.addEventListener('beforeinstallprompt', evt => {
    deferredInstallPrompt = evt
    showInstallButton = !(
      window.matchMedia('(display-mode: standalone)').matches ||
      navigator['standalone']
    )
  })
  window.addEventListener('appinstalled', evt => {
    showInstallButton = false
    alreadyInstalled = true
  })
  const install = async () => {
    if (isIos) {
      showInstallOverlay = !showInstallOverlay
    } else {
      deferredInstallPrompt.prompt()
      const choice = deferredInstallPrompt.userChoice
      if (choice.outcome === 'accepted') {
        showInstallButton = false
        alreadyInstalled = true
      }
    }
  }
  $effect(() => {
    if (!alreadyInstalled && iOSCanInstall && !iOSIsInstalled) {
      showInstallButton = true
    }
  })
</script>

<Button
  class={[
    'border-primary border-2 p-2',
    showInstallButton ? 'inline-block' : 'hidden',
  ]}
  onclick={install}
>
  Als App installieren
</Button>

{#if showInstallButton && showInstallOverlay}
  <div
    class="fixed right-0 bottom-1 left-0 flex justify-center"
    transition:scale
  >
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      class="helper relative rounded-sm bg-neutral-100 p-2 text-center text-neutral-900 shadow-md"
      role="button"
      tabindex="0"
      onclick={() => (showInstallOverlay = false)}
    >
      Zum <strong>Home Screen</strong> hinzufügen:
      <p class="*:inline-block *:size-5">
        <SvgIcon d={shareIcon} />
        und dann
        <SvgIcon d={addBox} />
      </p>
    </div>
  </div>
{/if}
