<svelte:options immutable />

<script lang="ts">
  import { scale } from 'svelte/transition'
  import { addBox, shareIcon } from './icons/icons'
  import SvgIcon from './icons/SvgIcon.svelte'
  let isIos = /iPad|iPhone|iPod/.test(navigator.userAgent)
  let showInstallButton = false
  let showInstallOverlay = false
  let alreadyInstalled = false
  let deferredInstallPrompt
  const iOSCanInstall = 'standalone' in window.navigator
  const iOSIsInstalled = window.navigator['standalone'] === true

  window.addEventListener('beforeinstallprompt', e => {
    deferredInstallPrompt = e
    if (
      !(
        window.matchMedia('(display-mode: standalone)').matches ||
        navigator['standalone']
      )
    )
      showInstallButton = true
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
  if (!alreadyInstalled && iOSCanInstall && !iOSIsInstalled) {
    showInstallButton = true
  }
</script>

{#if showInstallButton}
  <button
    class="border border-solid rounded-md border-gray-400 mb-4 p-2 inline-block dark:(bg-dark-400 text-gray-300) light:(text-gray-800) "
    on:click={install}>Als App installieren</button
  >
{/if}

{#if showInstallButton && showInstallOverlay}
  <div
    class="flex right-0 bottom-1 left-0 justify-center fixed"
    transition:scale
  >
    <div
      class="rounded bg-light-100 shadow-md p-2 text-dark-400 helper relative"
      on:click={() => (showInstallOverlay = false)}
    >
      Zum <strong>Home Screen</strong> hinzufügen:
      <span class="install-icon">
        <SvgIcon d={shareIcon} fill="#16c" outline />
      </span>
      und
      <span class="install-icon">
        <SvgIcon d={addBox} fill="#16c" outline />
      </span>
    </div>
  </div>
{/if}

<style global>
  .helper:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-top: solid 5px #fefefe;
    border-left: solid 5px transparent;
    border-right: solid 5px transparent;
  }

  .install-icon {
    @apply h-5 -mx-1 w-5 inline-block align-middle;
  }
</style>
