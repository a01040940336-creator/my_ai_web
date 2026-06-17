import { supabase } from './supabase.js'
import { showToast, formatType, formatGenres } from './utils.js'

const BASE = import.meta.env.BASE_URL

function cardHTML(item) {
  return `
    <div class="content-card" data-id="${item.id}" data-trailer="${item.trailer_url || ''}">
      <img class="card-thumb" src="${item.thumbnail_url}" alt="${item.title}" loading="lazy">
      <div class="card-hover-overlay">
        <div class="card-hover-title">${item.title}</div>
        <div class="card-hover-actions">
          <button class="btn btn-primary play-btn" data-trailer="${item.trailer_url || ''}">▶ 예고편</button>
          <a href="${BASE}html/detail.html?id=${item.id}" class="btn btn-ghost">정보</a>
        </div>
      </div>
      <div class="card-info">
        <div class="card-title">${item.title}</div>
        <div class="card-meta">
          <span class="badge badge-type">${formatType(item.type)}</span>
          <span>⭐${item.rating}</span>
        </div>
      </div>
    </div>`
}

function openTrailer(url) {
  if (!url) { showToast('예고편 준비 중입니다'); return }
  const modal = document.getElementById('trailer-modal')
  document.getElementById('trailer-iframe').src = url + '?autoplay=1'
  modal.style.display = 'flex'
}

function closeTrailer() {
  const modal = document.getElementById('trailer-modal')
  modal.style.display = 'none'
  document.getElementById('trailer-iframe').src = ''
}

async function loadFeatured(all) {
  const featured = all.find(c => c.is_featured) || all[0]
  if (!featured) return

  document.getElementById('hero-img').src = featured.backdrop_url || featured.thumbnail_url
  document.getElementById('hero-title').textContent = featured.title
  document.getElementById('hero-desc').textContent = featured.description || ''
  document.getElementById('hero-type').textContent = formatType(featured.type)
  document.getElementById('hero-rating').textContent = featured.rating
  document.getElementById('hero-year').textContent = featured.release_year
  document.getElementById('hero-genre').textContent = (featured.genre || []).slice(0,2).join(' · ')

  document.getElementById('hero-play-btn').onclick = () => openTrailer(featured.trailer_url)
  document.getElementById('hero-detail-btn').onclick = () => {
    window.location.href = BASE + 'html/detail.html?id=' + featured.id
  }
}

function fillRow(rowId, items) {
  const row = document.getElementById(rowId)
  if (!row) return
  if (!items.length) { row.innerHTML = '<p style="color:var(--text-muted);font-size:.875rem;padding:8px 0">콘텐츠가 없습니다</p>'; return }
  row.innerHTML = items.map(cardHTML).join('')
  row.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); openTrailer(btn.dataset.trailer) })
  })
  row.querySelectorAll('.content-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.play-btn') || e.target.closest('a')) return
      window.location.href = BASE + 'html/detail.html?id=' + card.dataset.id
    })
  })
}

async function init() {
  const { data, error } = await supabase.from('movion_contents').select('*').order('created_at', { ascending: false })
  if (error) { showToast('콘텐츠를 불러올 수 없습니다'); return }
  const all = data || []

  await loadFeatured(all)
  fillRow('featured-row', all.slice(0, 6))
  fillRow('movies-row', all.filter(c => c.type === 'movie'))
  fillRow('drama-row', all.filter(c => c.type === 'drama' || c.type === 'series'))

  document.getElementById('modal-close').addEventListener('click', closeTrailer)
  document.getElementById('trailer-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeTrailer()
  })
}

init()
