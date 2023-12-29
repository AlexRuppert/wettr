<script lang="ts">
  import AppInstall from './AppInstall.svelte'
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
</script>

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
</footer>
