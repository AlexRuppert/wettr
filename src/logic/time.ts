export function getSunriseSunset(date: Date, lat: number, lon: number) {
  const noon = new Date(date.toISOString().substr(0, 10) + 'T12:00Z')
  function sinDegree(angleDegrees: number) {
    return Math.sin(angleDegrees * (Math.PI / 180))
  }

  function asinDegree(angle: number) {
    return Math.asin(angle) * (180 / Math.PI)
  }
  function cosDegree(angleDegrees: number) {
    return Math.cos(angleDegrees * (Math.PI / 180))
  }
  function acosDegree(angle: number) {
    return Math.acos(angle) * (180 / Math.PI)
  }

  function toRegularDate(julian: number) {
    return new Date((julian - 2440587.5) * 86400000)
  }

  const julianDate = Math.floor(noon.getTime() / 86400000 + 2440587.5)
  const n = julianDate - 2451545.0 + 0.0008
  const meanSolarTime = n - lon / 360
  const M = (357.5291 + 0.98560028 * meanSolarTime) % 360
  const C =
    1.9148 * sinDegree(M) + 0.02 * sinDegree(2 * M) + 0.0003 * sinDegree(3 * M)

  const lambda = (M + C + 180 + 102.9372) % 360
  const solarTransit =
    2451545.0 +
    meanSolarTime +
    0.0053 * sinDegree(M) -
    0.0069 * sinDegree(2 * lambda)

  const declinationOfSun = asinDegree(sinDegree(lambda) * sinDegree(23.44))
  const hourAngle = acosDegree(
    (sinDegree(-0.83) - sinDegree(lat) * sinDegree(declinationOfSun)) /
      (cosDegree(lat) * cosDegree(declinationOfSun))
  )

  return {
    sunrise: toRegularDate(solarTransit - hourAngle / 360),
    sunset: toRegularDate(solarTransit + hourAngle / 360),
  }
}
