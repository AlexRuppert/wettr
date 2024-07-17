<script lang="ts">
  import wettrIcon from '@/assets/icon.svg?url'
  import { type CustomElement } from '@/logic/svelte.svelte'
  import { getMatrix, renderPath } from 'qr-code-generator-lib'
  import Popup from './common/Popup.svelte'

  interface Props extends CustomElement {
    show: boolean
  }
  let { show = $bindable(false), ...other }: Props = $props()
  let matrix: boolean[][] = $state([])
  const MATRIX_MARGIN = 6
  let matrixDimension = $derived(matrix.length + MATRIX_MARGIN)

  $effect(() => {
    if (show) {
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

<Popup bind:opened={show}>
  <div class="flex min-w-72 flex-col bg-white">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${matrixDimension} ${matrixDimension}`}
    >
      <g
        transform={`translate( ${MATRIX_MARGIN / 2} ${MATRIX_MARGIN / 2})`}
        stroke-width="1.1"
        stroke-linecap="round"
      >
        {#each matrix as row, y}
          {#each row as cell, x}
            <line
              x1={x}
              y1={y}
              x2={x}
              y2={y}
              stroke={cell ? 'hsl(214 100% 36.50%' : ''}
            />
          {/each}
        {/each}
      </g>
      <g
        transform={`translate( ${matrixDimension / 2 - 5} ${matrixDimension / 2 - 5})`}
      >
        <circle r="5.1" fill="#fff" cx="5" cy="5" />
        <image stroke="red" href={wettrIcon} height="10" width="10" />
      </g>
    </svg>
    <div class="self-center p-2 font-semibold text-black">Wettr-Link</div>
  </div>
</Popup>
