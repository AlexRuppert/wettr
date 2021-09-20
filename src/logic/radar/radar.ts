export function getSateliteImageUrl(viewBounds, width, year = 2019) {
  const bbox = [
    viewBounds.lb.lat,
    viewBounds.lb.lon,
    viewBounds.rt.lat,
    viewBounds.rt.lon,
  ]
    .map(num => Number.parseFloat(num).toFixed(3))
    .join(',')
  return `https://sgx.geodatenzentrum.de/wms_sentinel2_de?service=wms&version=1.3.0&request=GetMap&Layers=rgb&STYLES=&BBOX=${bbox}&CRS=EPSG:4326&width=${width}&Height=${width}&Format=image/jpeg&TIME=${year}`
}
