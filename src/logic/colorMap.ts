const SHADES = 100
export function createColorMap(stops: { offset: number; color: string }[]) {
  const offscreen = new OffscreenCanvas(SHADES, 1)
  const ctx = offscreen.getContext('2d', { willReadFrequently: true })
  const gradient = ctx.createLinearGradient(0, 0, SHADES, 0)
  stops.forEach(({ offset, color }) => {
    gradient.addColorStop(offset, color)
  })
  ctx.fillStyle = gradient

  ctx.fillRect(0, 0, SHADES, 1)
  const colors = new Array(SHADES)
  for (let i = 0; i < SHADES; i++) {
    colors[i] = ctx.getImageData(i, 0, 1, 1).data
  }
  return (weight: number) => {
    weight = Math.max(0, Math.min(1, weight))
    return colors?.[Math.floor(weight * SHADES)] ?? colors[0]
  }
}

/*visualizer 
<div class="h-10 w-72">
    <canvas id="can" width="100" height="1"></canvas>
  </div>
const cmap = createColorMap([
    { offset: 0, color: '#05eff8' },
    { offset: 0.3, color: '#000083' },
    { offset: 0.6, color: '#880077' },
    { offset: 0.9, color: '#aa0000' },
    { offset: 1, color: '#ffff01' },
  ])

  setTimeout(() => {
    const el = document.getElementById('can')
    const ctx = el.getContext('2d')
    const screen = ctx.createImageData(1, 1)
    for (let i = 0; i < 100; i++) {
      const d = cmap(i / 100.0)
      console.log(d)
      screen.data[0] = d[0]
      screen.data[1] = d[1]
      screen.data[2] = d[2]
      screen.data[3] = 255
      ctx.putImageData(screen, i, 0)
    }
  }, 1000)*/
