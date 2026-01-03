<script lang="ts">
  import AppInstall from '@/components/AppInstall.svelte'
  import Button from './common/Button.svelte'
  import { shareIcon } from './icons/icons'
  import SvgIcon from './icons/SvgIcon.svelte'
  import ShareScreen from './ShareScreen.svelte'
  const links = [
    {
      label: 'Datenquelle',
      name: 'Deutscher Wetterdienst',
      href: 'https://www.dwd.de',
    },
    { label: 'API', name: 'brightsky.dev', href: 'https://brightsky.dev' },
    {
      label: 'Code',
      name: 'GitHub',
      href: 'https://github.com/AlexRuppert/wettr',
    },
  ]

  let showShareScreen = $state(false)
</script>

<ShareScreen bind:opened={showShareScreen}></ShareScreen>
<footer class="flex flex-col items-center space-y-8 py-10 text-sm">
  <AppInstall />
  <table>
    <tbody>
      {#each links as { label, name, href }}
        <tr>
          <td class="pr-5 text-right">{label}</td>
          <td class="h-6"
            ><a
              {href}
              class="text-text-soft underline"
              target="_blank"
              rel="noopener noreferrer">{name}</a
            ></td
          >
        </tr>
      {/each}
    </tbody>
  </table>

  <Button
    class="border-surface-100 flex border pr-4 pl-2"
    onclick={() => (showShareScreen = true)}
  >
    <SvgIcon d={shareIcon} class="size-6 pt-1"></SvgIcon>
    Teilen
  </Button>
</footer>
