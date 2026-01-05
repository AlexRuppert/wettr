<script lang="ts">
  import wettrIcon from '@/assets/icon.svg?url'
  import { type CustomElement } from '@/logic/svelte.svelte'
  import { getMatrix, renderPath } from 'qr-code-generator-lib'
  import Popup from './common/Popup.svelte'

  interface Props extends CustomElement {
    opened: boolean
  }
  let { opened = $bindable(false), ...other }: Props = $props()
  let matrix: boolean[][] = $state([])
  const MATRIX_MARGIN = 6
  let matrixDimension = $derived(matrix.length + MATRIX_MARGIN)
  let logoDimension = $derived(matrixDimension / 2 - 5)

  $effect(() => {
    if (opened) {
      renderQrCode()
      showOSShare()
    }
  })

  function renderQrCode() {
    matrix = getMatrix(window.location.href, 1)
  }
  //...

  async function showOSShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Wettr',
          text: 'Die einfache Wetter App.',
          url: window.location.href,
        })
      }
    } catch (e) {}
  }
</script>

<Popup bind:opened>
  <div class="flex min-w-72 flex-col bg-white">
    <svg viewBox={`0 0 ${matrixDimension} ${matrixDimension}`}>
      <g
        transform={`translate( ${MATRIX_MARGIN / 2} ${MATRIX_MARGIN / 2})`}
        stroke-width="1.1"
        stroke-linecap="round"
      >
        {#each matrix as row, y1}
          {#each row as cell, x1}
            <line
              class={[cell && 'stroke-primary']}
              {x1}
              {y1}
              x2={x1}
              y2={y1}
            />
          {/each}
        {/each}
      </g>
    </svg>
    <div class="self-center p-2 font-semibold text-black">Wettr-Link</div>
  </div>
</Popup>
