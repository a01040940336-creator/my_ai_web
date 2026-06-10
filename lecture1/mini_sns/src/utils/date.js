export const differenceInDays = (endDateStr) => {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const end = new Date(endDateStr); end.setHours(0, 0, 0, 0)
  return Math.floor((end - today) / 86400000)
}

export const formatDate = (str) => {
  if (!str) return ''
  const d = new Date(str)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export const formatDateShort = (str) => {
  if (!str) return ''
  const d = new Date(str)
  return `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export const getDdayLabel = (endDate) => {
  const d = differenceInDays(endDate)
  if (d < 0) return 'ENDED'
  if (d === 0) return 'D-DAY'
  return `D-${d}`
}

export const getStatusLabel = (startDate, endDate) => {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const start = new Date(startDate); start.setHours(0, 0, 0, 0)
  const daysLeft = differenceInDays(endDate)
  if (today < start) return 'UPCOMING'
  if (daysLeft < 0) return 'ENDED'
  if (daysLeft <= 3) return 'CLOSING SOON'
  return 'NOW OPEN'
}

export const getType = (category) => category === '전시' ? 'EXHIBITION' : 'POP-UP'

const THEME_MAP = { '아이돌': 'IDOL', '뷰티': 'BEAUTY', '패션': 'FASHION', '전시': 'ART', '라이프스타일': 'LIFESTYLE' }
export const getTheme = (category) => THEME_MAP[category] ?? category

export const getProgressPercent = (startDate, endDate) => {
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  const now = Date.now()
  if (now <= start) return 0
  if (now >= end) return 100
  return Math.round(((now - start) / (end - start)) * 100)
}

export const sortByDday = (posts) => {
  const getPriority = (p) => {
    const s = getStatusLabel(p.start_date, p.end_date)
    return { 'CLOSING SOON': 1, 'NOW OPEN': 2, 'UPCOMING': 3, 'ENDED': 4 }[s] ?? 5
  }
  return [...posts].sort((a, b) => {
    const d = getPriority(a) - getPriority(b)
    if (d !== 0) return d
    return new Date(a.end_date) - new Date(b.end_date)
  })
}

// 두 좌표 사이 거리(km) – Haversine
export const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
