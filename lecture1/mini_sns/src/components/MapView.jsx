import { useEffect, useRef, useCallback } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { getDdayLabel, getStatusLabel } from '../utils/date'

// Leaflet 아이콘 CDN fallback (번들러 경로 문제 해결)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const STATUS_COLOR = { 'CLOSING SOON': '#FF3B30', 'NOW OPEN': '#111', 'UPCOMING': '#888', 'ENDED': '#CCC' }

const MapView = ({ posts = [], onPostClick }) => {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markersLayer = useRef(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    const map = L.map(mapRef.current, { zoomControl: true }).setView([37.5326, 127.024], 12)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map)

    mapInstance.current = map
    markersLayer.current = L.layerGroup().addTo(map)

    return () => {
      map.remove()
      mapInstance.current = null
    }
  }, [])

  const renderMarkers = useCallback(() => {
    const map = mapInstance.current
    const layer = markersLayer.current
    if (!map || !layer) return

    layer.clearLayers()

    const geoPostss = posts.filter(p => p.latitude && p.longitude)
    if (geoPostss.length === 0) return

    geoPostss.forEach(post => {
      const status = getStatusLabel(post.start_date, post.end_date)
      const dday = getDdayLabel(post.end_date)
      const color = STATUS_COLOR[status] ?? '#111'

      const icon = L.divIcon({
        className: '',
        html: `<div style="
          background:${color};color:#fff;
          padding:5px 10px;border-radius:20px;
          font-size:11px;font-weight:800;white-space:nowrap;
          box-shadow:0 2px 8px rgba(0,0,0,0.22);
          cursor:pointer;
        ">${dday}</div>`,
        iconAnchor: [30, 15],
        popupAnchor: [0, -20],
      })

      const popupContent = document.createElement('div')
      popupContent.style.cssText = 'min-width:180px;padding:4px 0'

      if (post.images?.[0]) {
        const img = document.createElement('img')
        img.src = post.images[0]
        img.style.cssText = 'width:100%;height:90px;object-fit:cover;border-radius:6px;display:block;margin-bottom:8px'
        img.onerror = () => img.remove()
        popupContent.appendChild(img)
      }

      const title = document.createElement('div')
      title.textContent = post.title
      title.style.cssText = 'font-weight:700;font-size:13px;color:#111;margin-bottom:4px;line-height:1.3'
      popupContent.appendChild(title)

      const meta = document.createElement('div')
      meta.textContent = `${post.region} · ${dday}`
      meta.style.cssText = 'font-size:11px;color:#999;margin-bottom:10px'
      popupContent.appendChild(meta)

      const btn = document.createElement('button')
      btn.textContent = '상세 보기 →'
      btn.style.cssText = `
        width:100%;padding:8px;background:#111;color:#fff;
        border:none;border-radius:6px;font-size:12px;font-weight:700;
        cursor:pointer;
      `
      btn.onclick = () => onPostClick?.(post)
      popupContent.appendChild(btn)

      L.marker([post.latitude, post.longitude], { icon })
        .addTo(layer)
        .bindPopup(L.popup({ maxWidth: 200, className: 'popspot-popup' }).setContent(popupContent))
    })

    // 마커가 있을 경우 지도 영역 조정
    const group = L.featureGroup(layer.getLayers())
    if (layer.getLayers().length > 0) {
      try { map.fitBounds(group.getBounds().pad(0.2)) } catch {}
    }
  }, [posts, onPostClick])

  useEffect(() => { renderMarkers() }, [renderMarkers])

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      {posts.filter(p => p.latitude && p.longitude).length === 0 && (
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          bgcolor: 'rgba(255,255,255,0.9)', borderRadius: 2, px: 2.5, py: 1.5, textAlign: 'center',
          zIndex: 1000,
        }}>
          <Typography variant="caption" color="text.secondary">위치 정보가 없는 항목이에요.</Typography>
        </Box>
      )}
    </Box>
  )
}

export default MapView
