<script lang="ts">
  import SvgIcon from '@/components/icons/SvgIcon.svelte'
  import { addBox, shareIcon } from '@/components/icons/icons'
  import { scale } from 'svelte/transition'
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

{#if showInstallButton}
  <button
    class="dark:(bg-neutral-900 text-gray-300) light:(text-gray-800) mb-4 inline-block rounded-md border border-solid border-gray-400 p-2"
    onclick={install}>Als App installieren</button
  >
{/if}

{#if showInstallButton && showInstallOverlay}
  <div
    class="fixed bottom-1 left-0 right-0 flex justify-center"
    transition:scale
  >
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      class="helper relative rounded bg-neutral-100 p-2 text-neutral-900 shadow-md"
      role="button"
      tabindex="0"
      onclick={() => (showInstallOverlay = false)}
    >
      Zum <strong>Home Screen</strong> hinzufügen:
      <SvgIcon
        className="-mx-1 inline-block h-5 w-5 align-middle "
        d={shareIcon}
        fill="#16c"
        outline
      />
      und
      <SvgIcon
        className="-mx-1 inline-block h-5 w-5 align-middle "
        d={addBox}
        fill="#16c"
        outline
      />
    </div>
  </div>
{/if}
