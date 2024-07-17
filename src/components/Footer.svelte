<script lang="ts">
  import AppInstall from '@/components/AppInstall.svelte'
  import Button from './common/Button.svelte'
  import SvgIcon from './icons/SvgIcon.svelte'
  import { shareIcon } from './icons/icons'
  import ShareScreen from './ShareScreen.svelte'
  const links = [
    {
      label: 'Datenquelle',
      name: 'Deutscher Wetterdienst',
      href: 'https://www.dwd.de',
    },
    { label: 'via', name: 'brightsky.dev', href: '"https://brightsky.dev' },
    {
      label: 'Code',
      name: 'GitHub',
      href: 'https://github.com/AlexRuppert/wettr',
    },
  ]

  let showShareScreen = $state(false)
</script>

<ShareScreen bind:show={showShareScreen}></ShareScreen>
<footer class="py-10 text-center text-sm">
  <div class="self-center">
    <AppInstall />
  </div>

  {#each links as { label, name, href }}
    {label}
    <a
      {href}
      class="leading-7 text-text-soft underline"
      target="_blank"
      rel="noopener noreferrer">{name}</a
    ><br />
  {/each}
  <div class="my-5 flex justify-center">
    <Button
      class="flex rounded-md border border-solid border-gray-400 pr-2 pt-1"
      onclick={() => (showShareScreen = true)}
      ><SvgIcon d={shareIcon} class="w-6" outline></SvgIcon>Teilen</Button
    >
  </div>
</footer>
