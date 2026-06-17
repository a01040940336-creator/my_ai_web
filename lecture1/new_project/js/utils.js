export function showToast(msg, duration = 2500) {
  const el = document.getElementById('toast')
  if (!el) return
  el.textContent = msg
  el.classList.add('show')
  setTimeout(() => el.classList.remove('show'), duration)
}

export function formatType(type) {
  const map = { movie: '영화', drama: '드라마', series: '시리즈' }
  return map[type] || type
}

export function formatGenres(genres) {
  if (!genres || !genres.length) return ''
  return genres.join(' · ')
}

export function getParam(key) {
  return new URLSearchParams(window.location.search).get(key)
}
