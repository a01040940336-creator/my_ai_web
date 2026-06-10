// ── 날짜 기본 유틸 ──────────────────────────────

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

// ── D-day 라벨 ──────────────────────────────────

export const getDdayLabel = (endDate) => {
  const d = differenceInDays(endDate)
  if (d < 0) return 'ENDED'
  if (d === 0) return 'D-DAY'
  return `D-${d}`
}

// ── 상태 레이블 (영문) ──────────────────────────

export const getStatusLabel = (startDate, endDate) => {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const start = new Date(startDate); start.setHours(0, 0, 0, 0)
  const end = new Date(endDate); end.setHours(0, 0, 0, 0)
  const daysLeft = Math.floor((end - today) / 86400000)
  if (today < start) return 'UPCOMING'
  if (daysLeft < 0) return 'ENDED'
  if (daysLeft <= 3) return 'CLOSING SOON'
  return 'NOW OPEN'
}

// ── TYPE / THEME 매핑 ────────────────────────────

export const getType = (category) =>
  category === '전시' ? 'EXHIBITION' : 'POP-UP'

const THEME_MAP = {
  '아이돌': 'IDOL', '뷰티': 'BEAUTY', '패션': 'FASHION',
  '전시': 'ART', '라이프스타일': 'LIFESTYLE',
}
export const getTheme = (category) => THEME_MAP[category] ?? category

// ── 기간 진행률 0~100 ────────────────────────────

export const getProgressPercent = (startDate, endDate) => {
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  const now = Date.now()
  if (now <= start) return 0
  if (now >= end) return 100
  return Math.round(((now - start) / (end - start)) * 100)
}

// ── D-day 우선순위 정렬 ──────────────────────────
// CLOSING SOON(0-3일) → NOW OPEN(4일+) → UPCOMING → ENDED

export const sortByDday = (posts) => {
  const getPriority = (post) => {
    const label = getStatusLabel(post.start_date, post.end_date)
    if (label === 'CLOSING SOON') return 1
    if (label === 'NOW OPEN') return 2
    if (label === 'UPCOMING') return 3
    return 4 // ENDED
  }
  return [...posts].sort((a, b) => {
    const pa = getPriority(a), pb = getPriority(b)
    if (pa !== pb) return pa - pb
    return new Date(a.end_date) - new Date(b.end_date)
  })
}
