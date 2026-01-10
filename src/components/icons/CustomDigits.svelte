<script lang="ts">
  import { type CustomElement } from '@/logic/svelte.svelte'
  import { timelineNumbers } from './icons'
  interface Props extends CustomElement {
    number: number
  }
  let { number, class: className, ...other }: Props = $props()
  function placeDigitX(digitPath: string, x: number) {
    const REGEX = /^M(\S+)/
    const originalOffsetX = +digitPath.match(REGEX)[1]
    return digitPath.replace(REGEX, 'M' + (originalOffsetX + x))
  }
  function getDigits(number: number) {
    let d = ''
    const digits = number.toString().split('')
    if (digits.length == 1) {
      d = timelineNumbers[+digits[0]]
    } else {
      if (digits[0] == '1') {
        d = placeDigitX(timelineNumbers[1], -6)
        d += placeDigitX(timelineNumbers[+digits[1]], 4)
      } else {
        d = placeDigitX(timelineNumbers[2], -6)
        d += placeDigitX(timelineNumbers[+digits[1]], 6)
      }
    }
    return d
  }
</script>

<svg
  stroke-linecap="round"
  stroke-linejoin="round"
  fill="none"
  height="0.8rem"
  viewBox="-5 -1 32 32"
  text-anchor="middle"
  stroke="currentColor"
  stroke-width="1"
>
  <path d={getDigits(number)} class={[className]} />
</svg>

<style>
</style>
