import { supabase } from './supabase.js'
import { showToast, formatType } from './utils.js'

const BASE = import.meta.env.BASE_URL
let allContents = []
// URL 파라미터로 필터 초기값 (드로어 메뉴에서 전달)
const urlType = new URLSearchParams(location.search).get('type')
let activeFilter = urlType || 'all'

// common.css .card 기준 통일 HTML
function gridCardHTML(item) {
  return `
    <div class="card" data-id="${item.id}">
      <img src="${item.thumbnail_url || ''}" alt="${item.title}" loading="lazy"
           onerror="this.src='https://picsum.photos/seed/${item.id}/400/600'">
      <div class="card-overlay">
        <div class="card-overlay-title">${item.title}</div>
        <div class="card-overlay-actions">
          <button class="btn btn-primary play-btn btn-sm" data-trailer="${item.trailer_url || ''}">▶ 예고편</button>
          <a href="${BASE}html/detail.html?id=${item.id}" class="btn btn-ghost btn-sm">정보</a>
        </div>
      </div>
      <div class="card-body">
        <div class="card-title">${item.title}</div>
        <div class="card-meta">
          <span class="badge badge-type">${formatType(item.type)}</span>
          <span>⭐${item.rating}</span>
        </div>
      </div>
    </div>`
}

function renderGrid(filter) {
  const grid = document.getElementById('contents-grid')
  const filtered = filter === 'all' ? allContents : allContents.filter(c => c.type === filter)

  if (!filtered.length) {
    grid.innerHTML = `<div class="empty-state">
      <div class="empty-icon">🎬</div>
      <p class="empty-text">해당 콘텐츠가 없습니다</p>
    </div>`
    return
  }

  grid.innerHTML = filtered.map(gridCardHTML).join('')

  grid.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); openTrailer(btn.dataset.trailer) })
  })
  grid.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.play-btn') || e.target.closest('a')) return
      window.location.href = BASE + 'html/detail.html?id=' + card.dataset.id
    })
  })
}

function openTrailer(url) {
  if (!url) { showToast('예고편 준비 중입니다'); return }
  const modal = document.getElementById('trailer-modal')
  document.getElementById('trailer-iframe').src = url + '?autoplay=1'
  modal.style.display = 'flex'
}

function closeTrailer() {
  document.getElementById('trailer-modal').style.display = 'none'
  document.getElementById('trailer-iframe').src = ''
}

async function init() {
  const { data, error } = await supabase.from('movion_contents').select('*').order('created_at', { ascending: false })
  if (error) { showToast('콘텐츠를 불러올 수 없습니다'); return }
  allContents = data || []
  renderGrid(activeFilter)

  // URL 파라미터로 전달된 필터 탭 활성화
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.filter === activeFilter)
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'))
      tab.classList.add('active')
      activeFilter = tab.dataset.filter
      renderGrid(activeFilter)
    })
  })

  document.getElementById('modal-close').addEventListener('click', closeTrailer)
  document.getElementById('trailer-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeTrailer()
  })
}

init()
