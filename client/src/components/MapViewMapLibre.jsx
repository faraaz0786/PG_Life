/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef } from 'react'
import { Map, Marker, NavigationControl } from 'react-map-gl/maplibre'
import { Link } from 'react-router-dom'
import { CITY_CENTERS } from '../data/cityCenters'

// India fallback: [lng, lat]
const INDIA = [78.6569, 22.9734]

// Pull coordinates from item or fall back to city center + slight jitter
function coordsFromItem(item, i = 0) {
  // GeoJSON { coordinates: [lng, lat] }
  if (item?.location?.coordinates?.length === 2) {
    const [lng, lat] = item.location.coordinates
    return { lat, lng }
  }
  // Flat lat/lng numbers
  if (typeof item?.lat === 'number' && typeof item?.lng === 'number') {
    return { lat: item.lat, lng: item.lng }
  }
  // City center + tiny spread so markers don't overlap
  const base = CITY_CENTERS[item?.city]
  if (base) {
    const [lat, lng] = base
    const jitter = (i % 7) * 0.0012 // ~100m
    return { lat: lat + jitter, lng: lng + jitter }
  }
  // Country fallback
  return { lat: INDIA[1], lng: INDIA[0] }
}

function bboxFromPoints(points) {
  if (!points.length) return null
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity
  for (const p of points) {
    if (p.lng < minLng) minLng = p.lng
    if (p.lng > maxLng) maxLng = p.lng
    if (p.lat < minLat) minLat = p.lat
    if (p.lat > maxLat) maxLat = p.lat
  }
  return [[minLng, minLat], [maxLng, maxLat]]
}

export default function MapViewMapLibre({ items = [], city }) {
  const mapRef = useRef(null)

  const points = useMemo(
    () => items.map((it, idx) => ({ ...coordsFromItem(it, idx), it })),
    [items]
  )

  useEffect(() => {
    const map = mapRef.current?.getMap?.()
    if (!map) return

    if (!points.length) {
      const c = CITY_CENTERS[city]
      map.jumpTo({ center: c ? [c[1], c[0]] : INDIA, zoom: c ? 11 : 4.5 })
      return
    }

    const bounds = bboxFromPoints(points)
    if (bounds) {
      map.fitBounds(bounds, { padding: 40, duration: 0 })
    }
  }, [points, city])

  return (
    <div className="card overflow-hidden">
      <Map
        ref={mapRef}
        initialViewState={{ longitude: INDIA[0], latitude: INDIA[1], zoom: 4.5 }}
        style={{ width: '100%', height: 480 }}
        mapStyle="https://demotiles.maplibre.org/style.json"
        attributionControl={true}
      >
        <NavigationControl position="top-right" />

        {points.map((p, idx) => {
          const item = p.it
          const isDemo = String(item?._id || '').startsWith('demo-')
          const detailUrl = isDemo
            ? `/search?city=${encodeURIComponent(item?.city || '')}`
            : `/listing/${item?._id}`

          return (
            <Marker key={item?._id || idx} longitude={p.lng} latitude={p.lat} anchor="bottom">
              <Link
                to={detailUrl}
                className="rounded-full bg-indigo-600 text-white text-[10px] px-2 py-1 shadow hover:bg-indigo-500 transition"
                title={item?.title || 'PG'}
              >
                ₹{(item?.price ?? '').toLocaleString('en-IN')}
              </Link>
            </Marker>
          )
        })}
      </Map>
    </div>
  )
}
