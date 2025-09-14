/* eslint-disable react/prop-types */
import { useMemo, useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Link } from 'react-router-dom'
import { CITY_CENTERS } from '../data/cityCenters'

// Fix marker icons for Vite bundling (fallback when not using price pills)
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl })

const INDIA_CENTER = [22.9734, 78.6569] // [lat, lng]

// ---------- Basemap styles ----------
const TILES = {
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap, &copy; <a href="https://carto.com/">CARTO</a>',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap, &copy; <a href="https://carto.com/">CARTO</a>',
  },
  sat: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri — Source: Esri, Earthstar Geographics, and the GIS User Community',
  },
}

// Watch the app’s dark mode class and update automatically
function useDarkMode() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains('dark'))
    )
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])
  return dark
}

// Build {lat,lng} from item or fall back to city center + slight jitter
function coordsFromItem(item, i = 0) {
  if (item?.location?.coordinates?.length === 2) {
    const [lng, lat] = item.location.coordinates
    return { lat, lng }
  }
  if (typeof item?.lat === 'number' && typeof item?.lng === 'number') {
    return { lat: item.lat, lng: item.lng }
  }
  const base = CITY_CENTERS[item?.city]
  if (base) {
    const [lat, lng] = base
    const j = (i % 7) * 0.0012 // ~100m spread
    return { lat: lat + j, lng: lng + j }
  }
  return { lat: INDIA_CENTER[0], lng: INDIA_CENTER[1] }
}

// Price-pill marker
function priceIcon(price) {
  const txt = typeof price === 'number' ? `₹${price.toLocaleString('en-IN')}` : 'PG'
  return L.divIcon({
    html: `<div class="leaflet-price">${txt}</div>`,
    className: '', // use our CSS class (not Tailwind, so it won't be purged)
    iconSize: [1, 1],
    iconAnchor: [22, 14], // bottom-center-ish
  })
}

function FitToMarkers({ points, city, fitKey }) {
  const map = useMap()
  useEffect(() => {
    if (!points.length) {
      const c = CITY_CENTERS[city]
      map.setView(c ? [c[0], c[1]] : INDIA_CENTER, c ? 11 : 5)
      return
    }
    const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng]))
    map.fitBounds(bounds.pad(0.2), { animate: false })
  }, [points, city, map, fitKey])
  return null
}

export default function MapViewLeaflet({ items = [], city }) {
  const [style, setStyle] = useState('auto') // 'auto' | 'light' | 'dark' | 'sat'
  const [fitKey, setFitKey] = useState(0)
  const isDark = useDarkMode()

  const activeStyleKey = style === 'auto' ? (isDark ? 'dark' : 'light') : style
  const activeStyle = TILES[activeStyleKey] || TILES.light

  const points = useMemo(
    () => items.map((it, idx) => ({ ...coordsFromItem(it, idx), it })),
    [items]
  )
  const defaultCenter = CITY_CENTERS[city] || INDIA_CENTER

  return (
    <div className="relative">
      {/* Floating style controls */}
      <div className="absolute right-3 top-3 z-[1000] flex gap-2">
        <div className="map-ctl">
          <button className={`map-btn ${style === 'auto' ? 'map-btn--active' : ''}`} onClick={() => setStyle('auto')}>Auto</button>
          <button className={`map-btn ${activeStyleKey === 'light' && style !== 'auto' ? 'map-btn--active' : ''}`} onClick={() => setStyle('light')}>Light</button>
          <button className={`map-btn ${activeStyleKey === 'dark' && style !== 'auto' ? 'map-btn--active' : ''}`} onClick={() => setStyle('dark')}>Dark</button>
          <button className={`map-btn ${activeStyleKey === 'sat' ? 'map-btn--active' : ''}`} onClick={() => setStyle('sat')}>Sat</button>
        </div>
        <button className="map-ctl map-btn" onClick={() => setFitKey(Date.now())} title="Recenter">Recenter</button>
      </div>

      <div className="card overflow-hidden">
        <MapContainer
          center={[defaultCenter[0], defaultCenter[1]]}
          zoom={city ? 11 : 5}
          scrollWheelZoom
          style={{ height: 480, width: '100%' }}
        >
          <TileLayer attribution={activeStyle.attribution} url={activeStyle.url} />
          <FitToMarkers points={points} city={city} fitKey={fitKey} />

          {points.map((p, idx) => {
            const item = p.it
            const isDemo = String(item?._id || '').startsWith('demo-')
            const detailUrl = isDemo
              ? `/search?city=${encodeURIComponent(item?.city || '')}`
              : `/listing/${item?._id}`

            return (
              <Marker
                key={item?._id || idx}
                position={[p.lat, p.lng]}
                icon={priceIcon(item?.price)}
              >
                <Popup>
                  <div className="space-y-1">
                    <div className="font-semibold text-sm line-clamp-1">{item?.title || 'PG'}</div>
                    <div className="text-xs text-slate-600">
                      {item?.city} • ₹{(item?.price ?? '').toLocaleString('en-IN')}
                    </div>
                    <Link to={detailUrl} className="text-xs text-indigo-600 hover:underline">
                      {isDemo ? `See PGs in ${item?.city || 'this city'}` : 'Open details'}
                    </Link>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>
    </div>
  )
}
