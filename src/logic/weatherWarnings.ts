export function processWarningData(warningData) {
  return warningData.warnings.map(w => {
    return {
      event: w.event,
      description: w.description,
      time: { start: new Date(w.start), end: new Date(w.end) },
      instruction: w.instruction,
      level: w.level,
      type: w.type,
      regions: w.regions.map(r => r.polygon),
      urls: w.urls,
    }
  })
}

function polygon2Coordinates(polygon) {
  var temp = []
  for (let i = 0; i < polygon.length / 2; i++) {
    temp.push({ lat: polygon[i * 2], lon: polygon[i * 2 + 1] })
  }
  return temp
}
