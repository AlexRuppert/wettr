<script lang="ts">
  import { type CustomElement } from '@/logic/svelte.svelte'
  import { cn } from '@/logic/utils'
  interface Props extends CustomElement {
    top: string
    bottom: string
  }

  let { top, bottom, className = '', ...other }: Props = $props()
</script>

<div class={cn('self-center pt-0.5 text-[0.6rem]', className)} {...other}>
  <sup>{top}</sup>/<sub>{bottom}</sub>
</div>
