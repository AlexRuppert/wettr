<script lang="ts">
  import { alertWarning } from '@/components/icons/icons'
  import SvgIcon from '@/components/icons/SvgIcon.svelte'
  import { type CustomElement } from '@/logic/svelte.svelte'

  interface Props extends CustomElement {
    event?: string
    time?: string
  }
  let { event = '', time = '', class: className, ...other }: Props = $props()
</script>

<div
  class={['flex h-14 w-full items-center space-x-1 px-3', className]}
  {...other}
>
  <SvgIcon class="text-warning size-5" d={alertWarning} outline={false} />
  <div class="grow overflow-hidden text-left font-semibold text-ellipsis">
    {event}
  </div>
  <div class="text-right text-xs font-light">
    {time}
  </div>
</div>
