const TIMESTAMP_HEADER = 'x--cache-timestamp'
export async function getCachedRequest(
  url: URL | RequestInfo,
  maxAgeMinutes = 1e6,
) {
  let result = await caches.match(url)
  if (
    result &&
    result.headers.get(TIMESTAMP_HEADER) &&
    +result.headers.get(TIMESTAMP_HEADER) + maxAgeMinutes * 60 * 1000 >
      Date.now()
  ) {
    console.log('cached ' + url)
    return result
  }
  try {
    result = await fetch(url)

    //no need to wait before returning

    const newHeaders = new Headers(result.headers)
    newHeaders.set(TIMESTAMP_HEADER, Date.now().toString())

    const copy = result.clone()

    const cloned = new Response(copy.body, {
      status: copy.status,
      statusText: copy.statusText,
      headers: newHeaders,
    })

    ;(await caches.open('v1')).put(url, cloned)
    return result
  } catch (err) {
    return null
  }
}
