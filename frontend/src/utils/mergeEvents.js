function toTimestamp(value) {
  const ts = new Date(value || 0).getTime()
  return Number.isNaN(ts) ? 0 : ts
}

function buildEventKey(event) {
  if (event?._id) return `id:${event._id}`

  const title = (event?.title || '').trim().toLowerCase()
  const date = event?.eventDate || ''
  return `fallback:${title}:${date}`
}

export function mergeEvents(fallbackEvents = [], fetchedEvents = []) {
  const mergedMap = new Map()

  // Keep fallback first so API events can override exact duplicates by key.
  fallbackEvents.forEach((event) => {
    mergedMap.set(buildEventKey(event), event)
  })

  fetchedEvents.forEach((event) => {
    mergedMap.set(buildEventKey(event), event)
  })

  return [...mergedMap.values()].sort((a, b) => toTimestamp(b?.eventDate) - toTimestamp(a?.eventDate))
}
