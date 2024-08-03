<script lang="ts">
  import { classProp, type CustomElement } from '@/logic/svelte.svelte'
  import { timelineNumbers } from './icons'
  interface Props extends CustomElement {
    number: number
    x: number
    y: number
  }

  let { number, x, y, className, ...other }: Props = $props()
  let d = $derived(getDigits(number))
  const REGEX = /^M(\S+)/
  function placeDigitX(digitPath: string, x: number) {
    const originalOffsetX = +digitPath.match(REGEX)[1]
    return digitPath.replace(/^M(\S+)/, 'M' + (originalOffsetX + x))
  }
  function getDigits(number: number) {
    let d = ''
    const digits = number.toString().split('')
    if (digits.length == 1) {
      d = timelineNumbers[+digits[0]]
    } else {
      if (digits[0] == '1') {
        d = placeDigitX(timelineNumbers[1], -3)
        d += placeDigitX(timelineNumbers[+digits[1]], 6)
      } else {
        d = placeDigitX(timelineNumbers[2], -6)
        d += placeDigitX(timelineNumbers[+digits[1]], 6)
      }
    }
    return d
  }
</script>

<path
  class={classProp('', className)}
  {d}
  transform-origin="4 0"
  transform={`translate(${x - 15 / 2}, ${y}) scale(0.5)`}
  vector-effect="non-scaling-stroke"
  stroke={'currentColor'}
  stroke-width="1"
  {...other}
/>
