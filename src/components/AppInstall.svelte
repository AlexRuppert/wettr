<svelte:options immutable />

<script lang="ts">
  import { fade,scale } from 'svelte/transition'
  import { mdiPlusBoxOutline } from '@mdi/js'
  let isIos = /iPad|iPhone|iPod/.test(navigator.userAgent)
  let showInstallButton = false
  let showInstallOverlay = true
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
  if (!alreadyInstalled && iOSCanInstall) {
    if (!iOSIsInstalled) {
      showInstallButton = true
    }
  }
</script>

{#if showInstallButton}
  <button
    class="border border-solid rounded-md border-gray-400 mb-4 p-2 text-gray-800 inline-block dark:bg-dark-400 dark:text-gray-300"
    transition:fade
    on:click={install}>Als App installieren</button
  >
{/if}

{#if showInstallButton && showInstallOverlay}
  <div class=" flex w-full right-0 bottom-1 left-0 justify-center fixed"  transition:scale>
    <div
      class="rounded bg-light-100 shadow-md p-2 text-dark-400 helper relative"
      on:click={() => (showInstallOverlay = false)}
    >
      Zum <strong>Home Screen</strong> hinzufügen: <span
        class="h-5 w-5 inline-block align-middle"
      >
        <svg
          viewBox="0 0 22 22"
          stroke="#0a67c9"
          stroke-width="2"
          fill="transparent"
          width="100%"
          height="100%"
          stroke-linecap="round"
        >
          <path d="M8,7H7a2,2 0 0,0 -2,2V16a2,2 0 0,0 2,2H14a2,2 0 0,0 2,-2V9a2,2 0 0,0 -2,-2H13M10.5,13V1l3,3M10.5,1l-3,3" />
        </svg>
      </span>
      und
      <span class="h-5 -mt-1 w-5 inline-block align-middle">
        <svg viewBox="0 0 22 22" fill="#0a67c9" width="100%" height="100%">
          <path d={mdiPlusBoxOutline} />
        </svg>
      </span>
    </div>
  </div>
{/if}

<style>
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
</style>
