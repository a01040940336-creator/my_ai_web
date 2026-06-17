import { supabase } from './supabase.js'
import { getUser } from './auth.js'
import { showToast, formatType } from './utils.js'

const BASE = import.meta.env.BASE_URL

let allContents = []
let filteredContents = []
let visibleCount = 6
const STEP = 3

/* ──────────────────────────────
   카드 HTML (common.css .card)
────────────────────────────── */
function cardHTML(item) {
  return `
    <div class="card" data-id="${item.id}">
      <img src="${item.thumbnail_url || ''}" alt="${item.title}" loading="lazy"
           onerror="this.src='https://picsum.photos/seed/${item.id}/400/600'">
      <div class="card-body">
        <div class="card-title">${item.title}</div>
        <div class="card-meta">${(item.genre || []).slice(0,2).join(' · ') || formatType(item.type)}</div>
      </div>
    </div>`
}

/* ──────────────────────────────
   모달
────────────────────────────── */
function openTrailer(url) {
  if (!url) { showToast('예고편 준비 중입니다'); return }
  document.getElementById('trailer-iframe').src = url + '?autoplay=1'
  document.getElementById('trailer-modal').style.display = 'flex'
}
function closeTrailer() {
  document.getElementById('trailer-modal').style.display = 'none'
  document.getElementById('trailer-iframe').src = ''
}

/* ──────────────────────────────
   찜하기
────────────────────────────── */
async function addToWatchlist(contentId) {
  const user = await getUser()
  if (!user) { showToast('로그인 후 저장할 수 있습니다'); return }
  const { data: existing } = await supabase
    .from('movion_watchlist').select('id').eq('user_id', user.id).eq('content_id', contentId).single()
  if (existing) { showToast('이미 저장된 콘텐츠입니다') }
  else {
    await supabase.from('movion_watchlist').insert({ user_id: user.id, content_id: contentId })
    showToast('마이페이지에 저장했습니다! 🎬')
  }
}

/* ──────────────────────────────
   ① HERO
────────────────────────────── */
function setHero(item) {
  document.getElementById('hero-img').src = item.backdrop_url || item.thumbnail_url || ''
  document.getElementById('hero-label').textContent =
    formatType(item.type) + ' · ' + (item.genre || []).slice(0,2).join(' · ')
  document.getElementById('hero-title').textContent = item.title
  document.getElementById('hero-desc').textContent = item.description || ''
  document.getElementById('hero-play-btn').onclick = () => openTrailer(item.trailer_url)
  document.getElementById('hero-save-btn').onclick = () => addToWatchlist(item.id)
}

/* ──────────────────────────────
   ② TOP PICK (HERO 바로 아래)
────────────────────────────── */
function setTopPick(item) {
  const el = document.getElementById('top-pick-card')
  if (!el) return
  el.innerHTML = `
    <div class="top-pick-poster">
      <img src="${item.thumbnail_url || ''}" alt="${item.title}">
    </div>
    <div class="top-pick-info">
      <div class="top-pick-title">${item.title}</div>
      <div class="top-pick-meta">
        <span class="badge badge-type">${formatType(item.type)}</span>
        ${(item.genre || []).slice(0,2).map(g => `<span class="badge badge-genre">${g}</span>`).join('')}
        <span class="badge badge-rating">⭐ ${item.rating}</span>
      </div>
      <p class="top-pick-desc">${item.description || ''}</p>
      <div class="top-pick-actions">
        <button class="btn btn-primary" id="tp-play">▶ 예고편</button>
        <a href="${BASE}html/detail.html?id=${item.id}" class="btn btn-outline">상세 정보</a>
      </div>
    </div>`
  document.getElementById('tp-play').onclick = () => openTrailer(item.trailer_url)
}

/* ──────────────────────────────
   ③ RECOMMEND CAROUSEL (가로 스크롤)
────────────────────────────── */
function fillCarousel(items) {
  const track = document.getElementById('carousel-track')
  if (!track) return

  const cards = items.map(cardHTML).join('')
  const moreCard = `
    <a class="more-card" href="${BASE}html/contents.html">
      <div class="more-card-icon">＋</div>
      <div class="more-card-text">더보기</div>
    </a>`

  track.innerHTML = cards + moreCard

  track.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      window.location.href = BASE + 'html/detail.html?id=' + card.dataset.id
    })
  })

  enableDragScroll(track)
}

/* 마우스/터치 드래그 스크롤 */
function enableDragScroll(el) {
  let isDown = false, startX, scrollLeft

  const down = (e) => {
    isDown = true
    el.classList.add('grabbing')
    startX = (e.pageX ?? e.touches?.[0]?.pageX ?? 0) - el.offsetLeft
    scrollLeft = el.scrollLeft
  }
  const up = () => { isDown = false; el.classList.remove('grabbing') }
  const move = (e) => {
    if (!isDown) return
    e.preventDefault()
    const x = (e.pageX ?? e.touches?.[0]?.pageX ?? 0) - el.offsetLeft
    el.scrollLeft = scrollLeft - (x - startX) * 1.5
  }

  el.addEventListener('mousedown', down)
  el.addEventListener('touchstart', down, { passive: true })
  el.addEventListener('mouseleave', up)
  el.addEventListener('mouseup', up)
  el.addEventListener('touchend', up)
  el.addEventListener('mousemove', move)
  el.addEventListener('touchmove', move, { passive: false })
}

/* ──────────────────────────────
   ④ MAIN GRID + 더보기
────────────────────────────── */
function renderMainGrid() {
  const grid = document.getElementById('main-grid')
  const btn  = document.getElementById('load-more-btn')
  if (!grid) return

  const visible = filteredContents.slice(0, visibleCount)
  if (!visible.length) {
    grid.innerHTML = '<p style="color:#555;font-size:.875rem;grid-column:1/-1;padding:8px 0">콘텐츠가 없습니다</p>'
    if (btn) btn.style.display = 'none'
    return
  }

  grid.innerHTML = visible.map(cardHTML).join('')
  grid.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      window.location.href = BASE + 'html/detail.html?id=' + card.dataset.id
    })
  })

  if (btn) btn.style.display = visibleCount >= filteredContents.length ? 'none' : 'block'
}

/* 카테고리 필터 (드로어에서 호출) */
window.movionFilter = function(type) {
  filteredContents = type === 'all' ? allContents : allContents.filter(c => c.type === type)
  visibleCount = 6
  renderMainGrid()
  document.querySelectorAll('.drawer-filter-item').forEach(el => {
    el.classList.toggle('active', el.dataset.type === type)
  })
  document.getElementById('drawer')?.classList.remove('open')
  document.getElementById('drawer-overlay')?.classList.remove('show')
  document.getElementById('hamburger-btn')?.classList.remove('open')
  document.body.style.overflow = ''
}

/* 더보기 (main grid) */
window.movionLoadMore = function() {
  visibleCount += STEP
  renderMainGrid()
}

/* ──────────────────────────────
   ⑤ DETAIL SECTION (기존 상세)
────────────────────────────── */
function setDetailCard(item) {
  const el = document.getElementById('detail-card')
  if (!el) return
  el.innerHTML = `
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

/* ──────────────────────────────
   초기화
────────────────────────────── */
async function init() {
  const { data, error } = await supabase
    .from('movion_contents').select('*').order('created_at', { ascending: false })
  if (error) { showToast('콘텐츠를 불러올 수 없습니다'); return }

  allContents = data || []
  filteredContents = [...allContents]

  const featured = allContents.find(c => c.is_featured) || allContents[0]

  // ① Hero
  if (featured) setHero(featured)

  // ② TOP PICK (featured 콘텐츠 강조)
  if (featured) setTopPick(featured)

  // ③ Carousel (featured 제외 최대 10개)
  const carouselItems = allContents.filter(c => c.id !== featured?.id).slice(0, 10)
  fillCarousel(carouselItems)

  // ④ Main grid (전체)
  renderMainGrid()

  // ⑤ Detail section
  if (featured) setDetailCard(featured)

  // 모달
  document.getElementById('modal-close')?.addEventListener('click', closeTrailer)
  document.getElementById('trailer-modal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeTrailer()
  })
}

init()
