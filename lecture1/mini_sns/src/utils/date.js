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
