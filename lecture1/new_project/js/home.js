import { supabase } from './supabase.js'
import { getUser } from './auth.js'
import { showToast, formatType } from './utils.js'

const BASE = import.meta.env.BASE_URL

let allContents = []

/* ──────────────────────────────
   유틸
────────────────────────────── */
function getYear(item) {
  if (item.release_date) return item.release_date.substring(0, 4)
  if (item.created_at) return item.created_at.substring(0, 4)
  return ''
}

/* ──────────────────────────────
   카드 HTML
────────────────────────────── */
function cardHTML(item) {
  const year = getYear(item)
  const genres = (item.genre || []).slice(0, 2)
  const rating = item.rating ? '★ ' + Number(item.rating).toFixed(1) : ''
  const safeUrl = (item.trailer_url || '').replace(/'/g, "\\'")

  return `
    <div class="card fade-in" data-id="${item.id}" role="article" aria-label="${item.title}">
      <div class="card-poster">
        <img src="${item.thumbnail_url || ''}" alt="${item.title}" loading="lazy"
             onerror="this.src='https://picsum.photos/seed/${item.id}/300/450'">
        <div class="card-hover-overlay" aria-hidden="true">
          <button class="card-play-btn" onclick="event.stopPropagation();window.movionPlay('${safeUrl}')" aria-label="예고편 재생">▶</button>
        </div>
      </div>
      <div class="card-body">
        <div class="card-title">${item.title}</div>
        <div class="card-genres">
          ${genres.map(g => `<span class="genre-tag">${g}</span>`).join('')}
          ${!genres.length ? `<span class="genre-tag">${formatType(item.type)}</span>` : ''}
        </div>
        <div class="card-bottom-row">
          ${rating ? `<span class="card-rating">${rating}</span>` : ''}
          ${year ? `<span class="card-year">${year}</span>` : ''}
        </div>
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
window.movionPlay = openTrailer

/* ──────────────────────────────
   찜하기
────────────────────────────── */
async function addToWatchlist(contentId) {
  const user = await getUser()
  if (!user) { showToast('로그인 후 저장할 수 있습니다'); return }
  const { data: existing } = await supabase
    .from('movion_watchlist').select('id')
    .eq('user_id', user.id).eq('content_id', contentId).single()
  if (existing) {
    showToast('이미 저장된 콘텐츠입니다')
  } else {
    await supabase.from('movion_watchlist').insert({ user_id: user.id, content_id: contentId })
    showToast('내 목록에 저장했습니다! 🎬')
  }
}

/* ──────────────────────────────
   ① HERO
────────────────────────────── */
function setHero(item) {
  const backdrop = document.getElementById('hero-backdrop')
  if (backdrop) {
    const img = item.backdrop_url || item.thumbnail_url || ''
    if (img) backdrop.style.backgroundImage = `url('${img}')`
  }

  const badge = document.getElementById('hero-badge')
  if (badge) {
    const genres = (item.genre || []).slice(0, 2).join(' · ')
    badge.textContent = formatType(item.type) + (genres ? ' · ' + genres : '')
  }

  const titleEl = document.getElementById('hero-title')
  if (titleEl) titleEl.textContent = item.title

  const metaEl = document.getElementById('hero-meta')
  if (metaEl) {
    const year = getYear(item)
    const rating = item.rating ? Number(item.rating).toFixed(1) : null
    const runtime = item.runtime ? item.runtime + '분' : (item.type === 'series' && item.season_count ? item.season_count + '시즌' : null)
    const genres = (item.genre || []).slice(0, 3)

    metaEl.innerHTML = [
      rating ? `<span class="hero-meta-rating">★ ${rating}</span>` : '',
      year ? `<span class="hero-meta-info">${year}</span>` : '',
      genres.length ? `<span class="hero-meta-sep">|</span>` + genres.map(g => `<span class="hero-meta-genre">${g}</span>`).join('') : '',
      runtime ? `<span class="hero-meta-sep">|</span><span class="hero-meta-info">${runtime}</span>` : '',
    ].join('')
  }

  const descEl = document.getElementById('hero-desc')
  if (descEl) descEl.textContent = item.description || ''

  document.getElementById('hero-play-btn')?.addEventListener('click', () => openTrailer(item.trailer_url))
  document.getElementById('hero-save-btn')?.addEventListener('click', () => addToWatchlist(item.id))
}

/* ──────────────────────────────
   ② 주요 콘텐츠 그리드 (6개+)
────────────────────────────── */
function renderMainGrid(items) {
  const grid = document.getElementById('main-grid')
  if (!grid) return

  const slice = items.slice(0, 8)
  if (!slice.length) {
    grid.innerHTML = '<p style="color:#555;font-size:.875rem;grid-column:1/-1;padding:20px 0">콘텐츠가 없습니다</p>'
    return
  }

  grid.innerHTML = slice.map(cardHTML).join('')
  grid.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      window.location.href = BASE + 'html/detail.html?id=' + card.dataset.id
    })
  })
}

/* ──────────────────────────────
   ③ 상세 소개 섹션
────────────────────────────── */
function setDetail(item) {
  const section = document.getElementById('detail-section')
  if (!section) return

  const posterEl = document.getElementById('detail-poster')
  if (posterEl) {
    posterEl.src = item.thumbnail_url || ''
    posterEl.alt = item.title
    posterEl.onerror = () => { posterEl.src = `https://picsum.photos/seed/${item.id}/300/450` }
  }

  const titleEl = document.getElementById('detail-title')
  if (titleEl) titleEl.textContent = item.title

  const descEl = document.getElementById('detail-desc')
  if (descEl) descEl.textContent = item.description || ''

  const year = getYear(item)
  const runtime = item.runtime
    ? item.runtime + '분'
    : (item.type === 'series' ? (item.season_count ? item.season_count + '시즌' : '정보 없음') : '정보 없음')
  const genres = (item.genre || []).join(' · ') || formatType(item.type)

  const metaCards = [
    { icon: '🎬', label: '감독',     value: item.director  || '정보 없음' },
    { icon: '👥', label: '출연진',   value: item.cast      || '정보 없음' },
    { icon: '📅', label: '공개일',   value: item.release_date || year + '년' || '-' },
    { icon: '🔞', label: '관람등급', value: item.age_rating || '전체 이용가' },
    { icon: '⏱️', label: item.type === 'series' ? '시즌' : '러닝타임', value: runtime },
    { icon: '🎭', label: '장르',     value: genres },
  ]

  const metaGrid = document.getElementById('detail-meta-grid')
  if (metaGrid) {
    metaGrid.innerHTML = metaCards.map(m => `
      <div class="meta-card">
        <div class="meta-card-icon">${m.icon}</div>
        <div class="meta-card-label">${m.label}</div>
        <div class="meta-card-value" title="${m.value}">${m.value}</div>
      </div>`).join('')
  }

  const playBtn = document.getElementById('detail-play-btn')
  playBtn?.addEventListener('click', () => openTrailer(item.trailer_url))

  const moreLink = document.getElementById('detail-more-link')
  if (moreLink) moreLink.href = BASE + 'html/detail.html?id=' + item.id

  section.style.display = 'block'
}

/* ──────────────────────────────
   ④ TOP 10 배너
────────────────────────────── */
function setBanner(item) {
  const section = document.getElementById('banner-section')
  if (!section || !item) return

  const bgEl = document.getElementById('banner-bg')
  if (bgEl) {
    const img = item.backdrop_url || item.thumbnail_url || ''
    if (img) bgEl.style.backgroundImage = `url('${img}')`
  }

  const titleEl = document.getElementById('banner-title')
  if (titleEl) titleEl.textContent = item.title

  const descEl = document.getElementById('banner-desc')
  if (descEl) {
    const desc = item.description || ''
    descEl.textContent = desc.length > 100 ? desc.substring(0, 100) + '...' : desc
  }

  section.style.display = 'block'
}

/* ──────────────────────────────
   ⑤ 추천 그리드
────────────────────────────── */
function renderRecommendGrid(items) {
  const grid = document.getElementById('recommend-grid')
  if (!grid) return

  const slice = items.slice(0, 8)
  if (!slice.length) {
    grid.innerHTML = '<p style="color:#555;font-size:.875rem;grid-column:1/-1;padding:20px 0">콘텐츠가 없습니다</p>'
    return
  }

  grid.innerHTML = slice.map(cardHTML).join('')
  grid.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      window.location.href = BASE + 'html/detail.html?id=' + card.dataset.id
    })
  })
}

/* ──────────────────────────────
   카테고리 탭
────────────────────────────── */
window.movionCategory = function(cat) {
  document.querySelectorAll('.cat-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.cat === cat)
    t.setAttribute('aria-selected', t.dataset.cat === cat)
  })

  let items = [...allContents]

  if (cat === 'popular') {
    items.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
  } else if (cat === 'latest') {
    items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  } else if (cat === 'top-rated') {
    const high = items.filter(c => Number(c.rating || 0) >= 8).sort((a, b) => Number(b.rating) - Number(a.rating))
    items = high.length >= 4 ? high : items.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
  } else if (cat === 'family') {
    const familyGenres = ['가족', '애니메이션', '코미디', '판타지', '어드벤처', '뮤지컬']
    const filtered = items.filter(c => (c.genre || []).some(g => familyGenres.some(fg => g.includes(fg))))
    items = filtered.length >= 2 ? filtered : [...allContents]
  }

  renderRecommendGrid(items)
}

/* ──────────────────────────────
   장르 필터 (드로어)
────────────────────────────── */
window.movionFilter = function(type) {
  document.querySelectorAll('.drawer-filter-item').forEach(el => {
    el.classList.toggle('active', el.dataset.type === type)
  })
  document.getElementById('drawer')?.classList.remove('open')
  document.getElementById('drawer-overlay')?.classList.remove('show')
  document.getElementById('hamburger-btn')?.classList.remove('open')
  document.body.style.overflow = ''
}

/* ──────────────────────────────
   스크롤 애니메이션
────────────────────────────── */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.08 })

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el))
}

/* ──────────────────────────────
   초기화
────────────────────────────── */
async function init() {
  const { data, error } = await supabase
    .from('movion_contents').select('*').order('created_at', { ascending: false })

  if (error) { showToast('콘텐츠를 불러올 수 없습니다'); return }

  allContents = data || []

  const featured = allContents.find(c => c.is_featured) || allContents[0]
  const byRating = [...allContents].sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
  const bannerItem = byRating.find(c => c.id !== featured?.id) || byRating[0]

  if (featured) {
    setHero(featured)
    setDetail(featured)
  }

  setBanner(bannerItem)
  renderMainGrid(allContents)
  renderRecommendGrid([...allContents].sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0)))

  document.getElementById('modal-close')?.addEventListener('click', closeTrailer)
  document.getElementById('trailer-modal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeTrailer()
  })

  initScrollAnimations()
}

init()
