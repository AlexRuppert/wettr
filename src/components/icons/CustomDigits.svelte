<script lang="ts">
  import { type CustomElement } from '@/logic/svelte.svelte'
  import { timelineNumbers2 } from './icons'
  interface Props extends CustomElement {
    number: number
  }
  let { number, class: className, ...other }: Props = $props()

  let pathValue = $derived(getDigits(number))
  function placeDigitX(digitPath: string, x: number) {
    const REGEX = /^M(\S+)/
    const originalOffsetX = +digitPath.match(REGEX)[1]
    return digitPath.replace(REGEX, 'M' + (originalOffsetX + x))
  }
  const GAP_WIDTH = 5
  function getDigits(number: number) {
    let d = ''
    const digits = number.toString().split('')
    const paths = digits.map(digit => timelineNumbers2[+digit])
    const totalWidth =
      paths.reduce((acc, val) => (acc += val.width + GAP_WIDTH), 0) - GAP_WIDTH
    let offset = 0
    paths.forEach(p => {
      d += placeDigitX(p.d, offset)
      offset += p.width + GAP_WIDTH
    })
    return { d, totalWidth }
  }
</script>

<svg
  stroke-linecap="round"
  stroke-linejoin="round"
  fill="none"
  height="0.8rem"
  viewBox="-1 -1 {pathValue.totalWidth + 2} 32"
  text-anchor="middle"
  stroke="currentColor"
  stroke-width="1"
>
  <path d={pathValue.d} class={[className]} />
</svg>

<style>
</style>
