export const differenceInDays = (endDateStr) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const end = new Date(endDateStr)
  end.setHours(0, 0, 0, 0)
  return Math.floor((end - today) / (1000 * 60 * 60 * 24))
}

export const parseISO = (str) => new Date(str)

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

// 진행 상태: 예정 / 진행중 / 종료
export const getStatus = (startDate, endDate) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(0, 0, 0, 0)
  if (today < start) return '예정'
  if (today > end) return '종료'
  return '진행중'
}

// 기간 진행률 0~100
export const getProgressPercent = (startDate, endDate) => {
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  const now = Date.now()
  if (now <= start) return 0
  if (now >= end) return 100
  return Math.round(((now - start) / (end - start)) * 100)
}

export const getDdayLabel = (endDate) => {
  const d = differenceInDays(endDate)
  if (d < 0) return '종료'
  if (d === 0) return 'TODAY'
  return `D-${d}`
}
