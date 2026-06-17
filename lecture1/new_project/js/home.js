import { supabase } from './supabase.js'
import { getUser } from './auth.js'
import { showToast, formatType } from './utils.js'

const BASE = import.meta.env.BASE_URL

let allContents = []
let filteredContents = []
let visibleCount = 6
const STEP = 3

// ── 카드 HTML (common.css .card 기준) ──
function cardHTML(item) {
  return `
    <div class="card" data-id="${item.id}">
      <img src="${item.thumbnail_url || ''}" alt="${item.title}" loading="lazy"
           onerror="this.src='https://picsum.photos/seed/${item.id}/400/600'">
      <div class="card-body">
        <div class="card-title">${item.title}</div>
        <div class="card-meta">${(item.genre || []).slice(0, 2).join(' · ') || formatType(item.type)}</div>
      </div>
    </div>`
}

// ── 메인 그리드 렌더링 ──
function renderMainGrid() {
  const grid = document.getElementById('main-grid')
  const loadBtn = document.getElementById('load-more-btn')
  if (!grid) return

  const visible = filteredContents.slice(0, visibleCount)

  if (!visible.length) {
    grid.innerHTML = '<p style="color:#555;font-size:.875rem;grid-column:1/-1;padding:8px 0">해당 콘텐츠가 없습니다</p>'
    if (loadBtn) loadBtn.style.display = 'none'
    return
  }

  grid.innerHTML = visible.map(cardHTML).join('')
  grid.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      window.location.href = BASE + 'html/detail.html?id=' + card.dataset.id
    })
  })

  // 더보기 버튼 표시 여부
  if (loadBtn) {
    loadBtn.style.display = visibleCount >= filteredContents.length ? 'none' : 'block'
  }
}

// ── 카테고리 필터 (사이드 드로어에서 호출) ──
window.movionFilter = function(type) {
  filteredContents = (type === 'all')
    ? allContents
    : allContents.filter(c => c.type === type)
  visibleCount = 6
  renderMainGrid()

  // 드로어 필터 탭 active 상태 업데이트
  document.querySelectorAll('.drawer-filter-item').forEach(el => {
    el.classList.toggle('active', el.dataset.type === type)
  })

  // 드로어 닫기 (모바일 UX)
  document.getElementById('drawer')?.classList.remove('open')
  document.getElementById('drawer-overlay')?.classList.remove('show')
  document.getElementById('hamburger-btn')?.classList.remove('open')
  document.body.style.overflow = ''
}

// ── 더보기 ──
window.movionLoadMore = function() {
  visibleCount += STEP
  renderMainGrid()
}

// ── 예고편 모달 ──
function openTrailer(url) {
  if (!url) { showToast('예고편 준비 중입니다'); return }
  document.getElementById('trailer-iframe').src = url + '?autoplay=1'
  document.getElementById('trailer-modal').style.display = 'flex'
}
function closeTrailer() {
  document.getElementById('trailer-modal').style.display = 'none'
  document.getElementById('trailer-iframe').src = ''
}

// ── 찜하기 ──
async function addToWatchlist(contentId) {
  const user = await getUser()
  if (!user) { showToast('로그인 후 저장할 수 있습니다'); return }
  const { data: existing } = await supabase
    .from('movion_watchlist').select('id').eq('user_id', user.id).eq('content_id', contentId).single()
  if (existing) {
    showToast('이미 저장된 콘텐츠입니다')
  } else {
    await supabase.from('movion_watchlist').insert({ user_id: user.id, content_id: contentId })
    showToast('마이페이지에 저장했습니다! 🎬')
  }
}

// ── 히어로 설정 ──
function setHero(item) {
  document.getElementById('hero-img').src = item.backdrop_url || item.thumbnail_url || ''
  document.getElementById('hero-label').textContent =
    formatType(item.type) + ' · ' + (item.genre || []).slice(0, 2).join(' · ')
  document.getElementById('hero-title').textContent = item.title
  document.getElementById('hero-desc').textContent = item.description || ''
  document.getElementById('hero-play-btn').onclick = () => openTrailer(item.trailer_url)
  document.getElementById('hero-save-btn').onclick = () => addToWatchlist(item.id)
}

// ── 상세 카드 ──
function setDetailCard(item) {
  document.getElementById('detail-card').innerHTML = `
    <div class="detail-poster">
      <img src="${item.thumbnail_url || ''}" alt="${item.title}">
    </div>
    <div class="detail-info">
      <h3>${item.title}</h3>
      <p>${item.description || '줄거리 정보가 없습니다.'}</p>
      <ul>
        <li>장르: ${(item.genre || []).join(', ') || '-'}</li>
        <li>러닝타임: ${item.duration || '-'}</li>
        <li>${item.type === 'movie' ? '유형: 영화' : `에피소드: ${item.episodes || '-'}회`}</li>
        <li>평점: ⭐ ${item.rating}</li>
      </ul>
      <div class="highlight">🔥 지금 가장 인기 있는 콘텐츠</div>
    </div>`
}

// ── 추천 그리드 ──
function fillRecommend(items) {
  const grid = document.getElementById('recommend-grid')
  if (!grid) return
  grid.innerHTML = items.map(cardHTML).join('')
  grid.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      window.location.href = BASE + 'html/detail.html?id=' + card.dataset.id
    })
  })
}

// ── 초기화 ──
async function init() {
  const { data, error } = await supabase
    .from('movion_contents').select('*').order('created_at', { ascending: false })
  if (error) { showToast('콘텐츠를 불러올 수 없습니다'); return }

  allContents = data || []
  filteredContents = [...allContents]

  const featured = allContents.find(c => c.is_featured) || allContents[0]
  if (featured) { setHero(featured); setDetailCard(featured) }

  renderMainGrid()
  fillRecommend(allContents.filter(c => c.id !== featured?.id).slice(0, 4))

  document.getElementById('modal-close')?.addEventListener('click', closeTrailer)
  document.getElementById('trailer-modal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeTrailer()
  })
}

init()
