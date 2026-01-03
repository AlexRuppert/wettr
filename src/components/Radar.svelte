<script lang="ts">
  import olMap from 'ol/Map'
  import olView from 'ol/View'
  import ImageLayer from 'ol/layer/Image'
  import TileLayer from 'ol/layer/Tile'
  import OSM from 'ol/source/OSM'

  import { transform } from 'ol/proj'
  import olImageStatic from 'ol/source/ImageStatic'

  import { type Coordinates } from '@/logic/locations'
  import { type CustomElement } from '@/logic/svelte.svelte'
  import { weatherPrecipitation } from '@/stores/store.svelte'
  import { defaults } from 'ol/interaction/defaults.js'
  import { drawImage, GRID_CONSTANTS } from '@/logic/radar'
  import { reloadPercipitation } from '@/logic/reloader'
  import { clamp, isDarkMode } from '@/logic/utils'
  import Feature from 'ol/Feature'
  import Point from 'ol/geom/Point'
  import VectorLayer from 'ol/layer/Vector'
  import VectorSource from 'ol/source/Vector'
  import Circle from 'ol/style/Circle'
  import Fill from 'ol/style/Fill'
  import Stroke from 'ol/style/Stroke'
  import Style from 'ol/style/Style'
  import { onDestroy, onMount } from 'svelte'
  import Button from './common/Button.svelte'
  import IconButton from './common/IconButton.svelte'
  import SvgIcon from './icons/SvgIcon.svelte'
  import { overlapAll, pause, play } from './icons/icons'

  interface Props extends CustomElement {
    coordinates: Coordinates
  }

  let { coordinates, ...other }: Props = $props()

  let mapElement: HTMLElement
  let map: olMap
  let initialized = $state(0)

  const imageLayer = new ImageLayer()

  const marker = new Feature({
    geometry: new Point([0, 0]),
  })
  const vectorSource = new VectorSource({
    features: [marker],
  })
  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: () => {
      return new Style({
        image: new Circle({
          radius: 3,
          fill: new Fill({
            color: '#fc3d03',
          }),
          stroke: new Stroke({
            color: '#fc3d03',
            width: 1.5,
          }),
        }),

        zIndex: 100000,
      })
    },
  })
  $effect(() => {
    const mappedCoordinates = transform(
      [coordinates.lon, coordinates.lat],
      'EPSG:4326',
      'EPSG:3857',
    )
    marker.getGeometry()?.setCoordinates(mappedCoordinates)
  })
  onMount(initialize)
  onDestroy(() => cleanupResources(frames))

  async function initialize() {
    initialized = 0
    const pr = reloadPercipitation()
    const tileLayer = new TileLayer({
      source: new OSM(),
    })
    tileLayer.on('prerender', evt => {
      if (evt.context && isDarkMode()) {
        const context = evt.context as CanvasRenderingContext2D
        context.filter = 'invert(100%) brightness(1.55)  hue-rotate(180deg)'
        context.globalCompositeOperation = 'source-over'
      }
    })

    tileLayer.on('postrender', evt => {
      if (evt.context) {
        const context = evt.context as CanvasRenderingContext2D
        context.filter = 'none'
      }
    })
    map = new olMap({
      interactions: defaults({ dragPan: false, mouseWheelZoom: false }),
      target: mapElement,
      layers: [tileLayer, imageLayer, vectorLayer],
    })
    await pr
    initialized = 1
  }

  let frames = $state([])
  let superFrame = $state(null)

  let currentFrame = $state(0)

  let autoplay = $state(true)
  const AUTO_ANIMATION_SPEED = 300

  let currentTimeLabel = $state('')
  let oldWeatherPrecipitation = ''
  $effect(() => {
    if (
      initialized > 0 &&
      weatherPrecipitation?.value?.length > 0 &&
      oldWeatherPrecipitation !=
        createComparePrecipitation(weatherPrecipitation?.value)
    ) {
      oldWeatherPrecipitation = createComparePrecipitation(
        weatherPrecipitation?.value,
      )

      getFramesAsync(weatherPrecipitation?.value)
      setView(coordinates, weatherPrecipitation?.value)
    }
  })

  function createComparePrecipitation(data) {
    return JSON.stringify(data.map(d => ({ t: d.timestamp, c: d.coordinates })))
  }

  let lastAnimationTimestamp = 0
  function animateFrames(timestamp) {
    if (timestamp - lastAnimationTimestamp >= AUTO_ANIMATION_SPEED) {
      lastAnimationTimestamp = timestamp
      if (autoplay && initialized == 2) {
        nextFrame()
      }
    }

    window.requestAnimationFrame(animateFrames)
  }
  animateFrames(0)
  function nextFrame() {
    currentFrame++
    showCurrentFrame()
  }

  function showCurrentFrame() {
    if (currentFrame >= frames.length) {
      currentFrame = 0
    } else if (currentFrame < 0) {
      currentFrame = 0
    }
    showFrame(currentFrame)
  }

  function showFrame(idx) {
    idx = clamp(idx, 0, frames.length - 1)
    //console.log(frames[idx])
    currentTimeLabel = frames[idx].label
    try {
      imageLayer.setSource(frames[idx].source)
    } catch (error) {}
  }

  function showSuperFrame() {
    if (!superFrame) return
    autoplay = false
    currentTimeLabel = frames.at(-1).label
    currentFrame = frames.length - 1
    imageLayer.setSource(superFrame.source)
  }

  function setView(coordinates, records) {
    const record = records[0]
    const mappedCoordinates = record.coordinates.map(c =>
      transform(c, 'EPSG:4326', 'EPSG:3857'),
    )
    const viewExtent = [
      Math.min(...mappedCoordinates.map(m => m[0])) + 3000,
      Math.min(...mappedCoordinates.map(m => m[1])) + 3000,
      Math.max(...mappedCoordinates.map(m => m[0])) - 3000,
      Math.max(...mappedCoordinates.map(m => m[1])) - 3000,
    ]
    const viewCenter = transform(
      [coordinates.lon, coordinates.lat],
      'EPSG:4326',
      'EPSG:3857',
    )

    map.getView().set('extent', viewExtent)

    const view = new olView({
      smoothExtentConstraint: true,
      extent: viewExtent,
      center: viewCenter,
      zoom: 9,
      //minZoom: 9,
      maxZoom: 13,
    })

    map.setView(view)
  }

  function cleanupResources(frames) {
    autoplay = false
    frames?.forEach(f => {
      try {
        URL.revokeObjectURL(f?.source?.url_)
      } catch (err) {}
    })
    frames = []
  }
  async function getFramesAsync(records) {
    const images = await Promise.all(records.map(record => drawImage(record)))

    const canvas = new OffscreenCanvas(
      GRID_CONSTANTS.width,
      GRID_CONSTANTS.height,
    )
    const ctx = canvas.getContext('2d')
    let imgElems = await Promise.all(
      images.map(url => {
        const img = new Image()
        img.src = url.urlImage
        return new Promise(res => {
          img.onload = e => res(img)
        }) as Promise<CanvasImageSource>
      }),
    )

    imgElems.forEach(imgElem => {
      ctx.globalCompositeOperation = 'screen'
      ctx.globalAlpha = 0.5
      ctx.drawImage(imgElem, 0, 0)
    })
    frames = images.map(img => {
      return {
        label: img.timestamp.substring(11, 16),
        source: new olImageStatic({
          url: img.urlImage,
          projection: img.projection,
          imageExtent: img.extent,
          interpolate: false,
          attributions: '© <a href="https://www.dwd.de/">DWD</a>',
        }),
      }
    })

    const blob = await canvas.convertToBlob()

    superFrame = {
      label: 'all',
      source: new olImageStatic({
        url: window.URL.createObjectURL(blob),
        projection: images[0].projection,
        imageExtent: images[0].extent,
        interpolate: false,
        attributions: '© <a href="https://www.dwd.de/">DWD</a>',
      }),
    }
    //console.log(frames[0].source)
    initialized = 2
  }

  function advanceFrame(minutes: number) {
    autoplay = false
    currentFrame += minutes / 5
    if (currentFrame >= frames.length) currentFrame = frames.length - 1
    showCurrentFrame()
  }
</script>

<div class="flex w-208 max-w-full flex-col select-none">
  <div class="bg-surface-400 w-full self-center py-2 text-center">
    Regenradar
  </div>
  <div
    class="relative aspect-square max-h-[calc(70dvh-9rem)] w-full"
    bind:this={mapElement}
  >
    <div class="absolute top-0 left-0 z-99999 w-[calc(100%-3.75rem)]">
      <div
        class="bg-surface-500/40 absolute inline-block w-15 rounded-b-md py-1 text-center tabular-nums shadow-md backdrop-blur-xs transition-all ease-linear"
        style={`left: ${(currentFrame / (frames.length - 1)) * 100}%`}
      >
        {currentTimeLabel}
      </div>
    </div>
  </div>
  <div class="flex flex-col">
    <div class="flex w-full items-center justify-center *:size-14">
      <Button onclick={() => advanceFrame(-15)}>-15</Button>
      <Button onclick={() => advanceFrame(-5)}>-5</Button>
      <IconButton
        icon={autoplay ? pause : play}
        label="Abspielen/Pause"
        onclick={() => (autoplay = !autoplay)}
        outline={false}
      ></IconButton>
      <Button onclick={() => advanceFrame(5)}>+5</Button>
      <Button onclick={() => advanceFrame(15)}>+15</Button>
    </div>
    <div>
      <Button
        class="clickable flex h-14 w-full space-x-2"
        onclick={() => showSuperFrame()}
        ><SvgIcon d={overlapAll} class="mr-1 size-5"
        ></SvgIcon>Überlagern</Button
      >
    </div>
  </div>
</div>
