import { supabase } from './supabase.js'
import { getUser } from './auth.js'
import { showToast, formatType } from './utils.js'

const BASE = import.meta.env.BASE_URL

/* ═══════════════════════════════════════════════════════
   MOCK DATA  (카테고리별 다양한 콘텐츠, 필터 동작 보장)
═══════════════════════════════════════════════════════ */
const MOCK_CONTENTS = [
  // MOVIES ──────────────────────────────────
  { id:'m1', title:'인터스텔라',        type:'movie',  genre:['SF','어드벤처','드라마'],      rating:9.0, year:2014, recommendation:95, mood:['생각하게 하는','몰입감 있는'], description:'웜홀을 통해 우주로 떠난 탐험대가 인류의 미래를 구하기 위해 시간과 중력의 벽에 맞서는 거대한 이야기.' },
  { id:'m2', title:'기생충',            type:'movie',  genre:['스릴러','드라마','블랙코미디'],rating:8.6, year:2019, recommendation:92, mood:['몰입감 있는','생각하게 하는'], description:'전원 백수인 기택 가족이 부잣집에 하나씩 기생하며 벌어지는 계급의 블랙코미디.' },
  { id:'m3', title:'어벤져스: 엔드게임', type:'movie',  genre:['액션','SF','어드벤처'],       rating:8.4, year:2019, recommendation:88, mood:['신나는','몰입감 있는'], description:'우주의 절반이 사라진 후 살아남은 히어로들이 시간을 되돌리기 위한 마지막 작전을 펼친다.' },
  { id:'m4', title:'라라랜드',          type:'movie',  genre:['로맨스','뮤지컬','드라마'],    rating:8.0, year:2016, recommendation:85, mood:['감성적인','편안한'], description:'꿈을 좇는 재즈 뮤지션과 배우 지망생의 아름답고 씁쓸한 사랑 이야기.' },
  { id:'m5', title:'매트릭스',          type:'movie',  genre:['SF','액션'],                  rating:8.7, year:1999, recommendation:90, mood:['생각하게 하는','몰입감 있는'], description:'가상현실에 갇힌 인류의 진실을 깨달은 남자. 현실과 가상의 경계를 탐구하는 SF 걸작.' },
  { id:'m6', title:'탑건: 매버릭',      type:'movie',  genre:['액션','어드벤처'],             rating:8.3, year:2022, recommendation:87, mood:['신나는','몰입감 있는'], description:'전설의 파일럿 매버릭이 불가능한 임무를 앞두고 젊은 파일럿들을 이끌며 하늘로 돌아온다.' },
  { id:'m7', title:'올드보이',          type:'movie',  genre:['스릴러','미스터리'],           rating:8.4, year:2003, recommendation:82, mood:['몰입감 있는'], description:'15년 감금 후 풀려난 남자가 범인을 추적하는 과정에서 충격적인 진실을 마주한다.' },
  // DRAMAS ──────────────────────────────────
  { id:'d1', title:'오징어 게임',         type:'drama',  genre:['스릴러','드라마','서바이벌'],  rating:8.0, year:2021, recommendation:96, mood:['몰입감 있는','신나는'], description:'456억 상금을 위해 목숨을 건 서바이벌 게임에 참가한 사람들이 겪는 충격의 연속.' },
  { id:'d2', title:'이상한 변호사 우영우', type:'drama',  genre:['드라마','코미디','로맨스'],    rating:8.1, year:2022, recommendation:89, mood:['편안한','감성적인'], description:'자폐 스펙트럼을 가진 천재 변호사 우영우의 성장과 사랑, 세상과의 소통 이야기.' },
  { id:'d3', title:'사랑의 불시착',       type:'drama',  genre:['로맨스','드라마','코미디'],    rating:8.7, year:2019, recommendation:91, mood:['감성적인','편안한'], description:'패러글라이딩 사고로 북한에 불시착한 재벌 상속녀와 북한 장교의 운명적인 로맨스.' },
  { id:'d4', title:'킹덤',               type:'drama',  genre:['스릴러','역사','공포'],        rating:8.3, year:2019, recommendation:86, mood:['몰입감 있는','신나는'], description:'조선 시대 좀비 아포칼립스와 왕권 쟁탈이 맞물리는 긴장감 넘치는 서사.' },
  { id:'d5', title:'나의 해방일지',       type:'drama',  genre:['드라마','로맨스'],             rating:8.2, year:2022, recommendation:84, mood:['감성적인','편안한'], description:'서울 외곽 소도시 남매 세 명이 일상의 굴레에서 벗어나 해방을 찾아가는 이야기.' },
  // SERIES ──────────────────────────────────
  { id:'s1', title:'스트레인저 씽스',  type:'series', genre:['SF','공포','어드벤처'],       rating:8.7, year:2016, recommendation:93, mood:['몰입감 있는','신나는'], description:'1980년대 소도시에서 실종된 소년과 초자연적 현상을 파헤치는 아이들의 이야기.', season_count:4 },
  { id:'s2', title:'브레이킹 배드',    type:'series', genre:['드라마','스릴러','범죄'],     rating:9.5, year:2008, recommendation:98, mood:['몰입감 있는','생각하게 하는'], description:'말기암 진단을 받은 화학 교사가 마약 제조왕이 되어가는 과정. 역대 최고의 TV 시리즈.', season_count:5 },
  { id:'s3', title:'위처',             type:'series', genre:['판타지','액션','어드벤처'],   rating:8.0, year:2019, recommendation:85, mood:['신나는','몰입감 있는'], description:'대륙을 떠도는 괴물 사냥꾼 게롤트의 운명적인 여정과 전쟁의 소용돌이.', season_count:3 },
]

/* 카테고리별 포스터 이미지 시드 */
const POSTER_SEEDS = {
  m1:'interstellar14', m2:'parasite19', m3:'avengers19', m4:'lalaland16',
  m5:'matrix99', m6:'topgun22', m7:'oldboy03',
  d1:'squidgame21', d2:'wooyoungu22', d3:'lovestrike19', d4:'kingdom19', d5:'liberation22',
  s1:'stranger16', s2:'breaking08', s3:'witcher19',
}

let allContents = []
let currentMood  = null

/* ═══════════════════════════════════════════════════════
   데이터 초기화
═══════════════════════════════════════════════════════ */
function enrichItem(item, idx) {
  /* Supabase thumbnail_url을 쓰지 않음 — 동일 이미지 방지 */
  const seed = POSTER_SEEDS[item.id] || `c${idx + 1}${(item.type || 'x').charAt(0)}`
  return {
    ...item,
    year: item.year || item.release_date?.substring(0,4) || item.created_at?.substring(0,4) || '',
    _poster:   `https://picsum.photos/seed/${seed}p/300/450`,
    _backdrop: `https://picsum.photos/seed/${seed}bg/1280/720`,
    recommendation: item.recommendation || (75 + (idx * 13 % 22)),
  }
}

/* ═══════════════════════════════════════════════════════
   카드 HTML  (data-category, data-mood, 줄거리, 추천도)
═══════════════════════════════════════════════════════ */
function cardHTML(item) {
  const genres   = (item.genre || []).slice(0,2)
  const rating   = item.rating ? '★ ' + Number(item.rating).toFixed(1) : ''
  const year     = item.year || ''
  const rec      = item.recommendation || ''
  const desc     = (item.description || '').substring(0, 72) + (item.description?.length > 72 ? '…' : '')
  const moodStr  = (item.mood || []).join(',')
  const safeUrl  = (item.trailer_url || '').replace(/'/g, "\\'")

  return `
    <div class="card"
         data-id="${item.id}"
         data-category="${item.type || 'movie'}"
         data-title="${item.title.toLowerCase()}"
         data-genres="${(item.genre||[]).join(' ').toLowerCase()}"
         data-mood="${moodStr}"
         role="article" aria-label="${item.title}">
      <div class="card-poster">
        <img src="${item._poster}" alt="${item.title}" loading="lazy"
             onerror="this.onerror=null;this.src='https://picsum.photos/seed/${item.id}x/300/450'">
        <div class="card-hover-overlay" aria-hidden="true">
          ${desc ? `<p class="card-overlay-desc">${desc}</p>` : ''}
          <button class="card-play-btn"
                  onclick="event.stopPropagation();window.movionPlay('${safeUrl}')"
                  aria-label="예고편 재생">▶ 재생</button>
        </div>
      </div>
      <div class="card-body">
        <div class="card-title">${item.title}</div>
        <div class="card-genres">
          ${genres.map(g=>`<span class="genre-tag">${g}</span>`).join('')}
          ${!genres.length ? `<span class="genre-tag">${formatType(item.type)}</span>` : ''}
        </div>
        <div class="card-bottom-row">
          ${rating ? `<span class="card-rating">${rating}</span>` : ''}
          ${year   ? `<span class="card-year">${year}</span>` : ''}
        </div>
        ${rec ? `<div class="card-rec">AI 추천 ${rec}%</div>` : ''}
      </div>
    </div>`
}

/* Made For You 카드 (추천도 강조) */
function mfyCardHTML(item) {
  return `
    <div class="mfy-card" data-id="${item.id}">
      <div class="mfy-poster-wrap">
        <span class="mfy-rec-badge">${item.recommendation}%</span>
        <img src="${item._poster}" alt="${item.title}" loading="lazy"
             onerror="this.onerror=null;this.src='https://picsum.photos/seed/${item.id}mfy/300/450'">
      </div>
      <div class="mfy-body">
        <div class="mfy-title">${item.title}</div>
        <div class="mfy-meta">
          <span>${(item.genre||[])[0]||''}</span>
          <span class="mfy-type">${formatType(item.type)}</span>
        </div>
      </div>
    </div>`
}

/* ═══════════════════════════════════════════════════════
   DOM 필터 (재생성 없음)
═══════════════════════════════════════════════════════ */
function filterGrid(gridEl, type) {
  if (!gridEl) return
  const cards = gridEl.querySelectorAll('.card[data-category]')

  cards.forEach(c => { c.style.opacity = '0'; c.style.transform = 'translateY(4px)' })

  setTimeout(() => {
    let anyVisible = false
    cards.forEach(c => {
      const match = (type === 'all' || c.dataset.category === type)
      c.style.display = match ? 'flex' : 'none'
      if (match) anyVisible = true
    })
    requestAnimationFrame(() => requestAnimationFrame(() => {
      cards.forEach(c => {
        if (c.style.display !== 'none') {
          c.style.opacity = '1'
          c.style.transform = ''
        }
      })
    }))
  }, 200)
}

/* ═══════════════════════════════════════════════════════
   모달
═══════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════
   찜하기
═══════════════════════════════════════════════════════ */
async function addToWatchlist(contentId) {
  if (String(contentId).startsWith('mock-') || !contentId.includes('-')) {
    showToast('내 목록에 추가했습니다 ♥')
    return
  }
  const user = await getUser()
  if (!user) { showToast('로그인 후 저장할 수 있습니다'); return }
  const { data: ex } = await supabase.from('movion_watchlist').select('id')
    .eq('user_id', user.id).eq('content_id', contentId).single()
  if (ex) showToast('이미 저장된 콘텐츠입니다')
  else {
    await supabase.from('movion_watchlist').insert({ user_id: user.id, content_id: contentId })
    showToast('내 목록에 저장했습니다! 🎬')
  }
}

/* ═══════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════ */
function setHero(item) {
  const bd = document.getElementById('hero-backdrop')
  if (bd && item._backdrop) bd.style.backgroundImage = `url('${item._backdrop}')`

  const badge = document.getElementById('hero-badge')
  if (badge) {
    const g = (item.genre||[]).slice(0,2).join(' · ')
    badge.textContent = formatType(item.type) + (g ? ' · ' + g : '')
  }

  const titleEl = document.getElementById('hero-title')
  if (titleEl) titleEl.textContent = item.title

  const metaEl = document.getElementById('hero-meta')
  if (metaEl) {
    const rating  = item.rating  ? Number(item.rating).toFixed(1) : null
    const runtime = item.runtime ? item.runtime + '분'
                  : (item.type === 'series' && item.season_count ? item.season_count + '시즌' : null)
    const genres  = (item.genre||[]).slice(0,3)
    metaEl.innerHTML = [
      rating ? `<span class="hero-meta-rating">★ ${rating}</span>` : '',
      item.year ? `<span class="hero-meta-info">${item.year}</span>` : '',
      genres.length ? `<span class="hero-meta-sep">|</span>` + genres.map(g=>`<span class="hero-meta-genre">${g}</span>`).join('') : '',
      runtime ? `<span class="hero-meta-sep">|</span><span class="hero-meta-info">${runtime}</span>` : '',
    ].join('')
  }

  const descEl = document.getElementById('hero-desc')
  if (descEl) descEl.textContent = item.description || ''

  /* onclick으로 덮어쓰기 — addEventListener 중복 방지 */
  const playBtn = document.getElementById('hero-play-btn')
  const saveBtn = document.getElementById('hero-save-btn')
  if (playBtn) playBtn.onclick = () => openTrailer(item.trailer_url)
  if (saveBtn) saveBtn.onclick = () => addToWatchlist(item.id)
}

/* ═══════════════════════════════════════════════════════
   Made For You 섹션
═══════════════════════════════════════════════════════ */
function renderMadeForYou(items) {
  const track = document.getElementById('mfy-track')
  if (!track) return
  const top = [...items].sort((a,b) => (b.recommendation||0) - (a.recommendation||0)).slice(0,6)
  track.innerHTML = top.map(mfyCardHTML).join('')
  track.querySelectorAll('.mfy-card').forEach(c => {
    c.addEventListener('click', () => {
      window.location.href = BASE + 'html/detail.html?id=' + c.dataset.id
    })
  })
  enableDragScroll(track)
}

/* ═══════════════════════════════════════════════════════
   주요 콘텐츠 그리드 (한 번만 렌더)
═══════════════════════════════════════════════════════ */
function renderMainGrid(items) {
  const grid = document.getElementById('main-grid')
  if (!grid) return
  grid.innerHTML = items.length
    ? items.map(cardHTML).join('')
    : '<p style="color:#535353;font-size:.875rem;grid-column:1/-1;padding:20px 0">콘텐츠가 없습니다</p>'
  grid.querySelectorAll('.card').forEach(c => {
    c.addEventListener('click', () => {
      window.location.href = BASE + 'html/detail.html?id=' + c.dataset.id
    })
  })
}

/* ═══════════════════════════════════════════════════════
   추천 그리드 (한 번만 렌더)
═══════════════════════════════════════════════════════ */
function renderRecommendGrid(items) {
  const grid = document.getElementById('recommend-grid')
  if (!grid) return
  grid.innerHTML = items.length
    ? items.map(cardHTML).join('')
    : '<p style="color:#535353;font-size:.875rem;grid-column:1/-1;padding:20px 0">콘텐츠가 없습니다</p>'
  grid.querySelectorAll('.card').forEach(c => {
    c.addEventListener('click', () => {
      window.location.href = BASE + 'html/detail.html?id=' + c.dataset.id
    })
  })
}

/* ═══════════════════════════════════════════════════════
   상세 소개 섹션
═══════════════════════════════════════════════════════ */
function setDetail(item) {
  const section = document.getElementById('detail-section')
  if (!section) return
  const posterEl = document.getElementById('detail-poster')
  if (posterEl) {
    posterEl.src = item._poster || ''
    posterEl.alt = item.title
    posterEl.onerror = () => { posterEl.src = `https://picsum.photos/seed/${item.id}d/300/450` }
  }
  const titleEl = document.getElementById('detail-title')
  if (titleEl) titleEl.textContent = item.title
  const descEl = document.getElementById('detail-desc')
  if (descEl) descEl.textContent = item.description || ''

  const runtime = item.runtime ? item.runtime + '분'
    : (item.type === 'series' ? (item.season_count ? item.season_count + '시즌' : '정보 없음') : '정보 없음')
  const genres  = (item.genre||[]).join(' · ') || formatType(item.type)

  const metaCards = [
    { icon:'🎬', label:'감독',     value: item.director  || '정보 없음' },
    { icon:'👥', label:'출연진',   value: item.cast       || '정보 없음' },
    { icon:'📅', label:'공개일',   value: item.release_date || (item.year+'년') || '-' },
    { icon:'🔞', label:'관람등급', value: item.age_rating || '전체 이용가' },
    { icon:'⏱️', label: item.type==='series' ? '시즌' : '러닝타임', value: runtime },
    { icon:'🎭', label:'장르',     value: genres },
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
  document.getElementById('detail-play-btn')?.addEventListener('click', () => openTrailer(item.trailer_url))
  const moreLink = document.getElementById('detail-more-link')
  if (moreLink) moreLink.href = BASE + 'html/detail.html?id=' + item.id
  section.style.display = 'block'
}

/* ═══════════════════════════════════════════════════════
   TOP 10 배너
═══════════════════════════════════════════════════════ */
function setBanner(item) {
  const section = document.getElementById('banner-section')
  if (!section || !item) return
  const bg = document.getElementById('banner-bg')
  if (bg) bg.style.backgroundImage = `url('${item._backdrop||''}')`
  const t = document.getElementById('banner-title')
  if (t) t.textContent = item.title
  const d = document.getElementById('banner-desc')
  if (d) {
    const desc = item.description || ''
    d.textContent = desc.length > 100 ? desc.substring(0,100) + '…' : desc
  }
  section.style.display = 'block'
}

/* ═══════════════════════════════════════════════════════
   Hero 카테고리별 전환 (fade 애니메이션)
═══════════════════════════════════════════════════════ */
function updateHeroForCategory(type) {
  const pool = type === 'all'
    ? allContents
    : allContents.filter(c => c.type === type)
  const item = pool.find(c => c.is_featured) || pool[0]
  if (!item) return

  const heroEl = document.getElementById('hero')
  if (!heroEl) { setHero(item); return }

  /* fade out → 콘텐츠 교체 → fade in */
  heroEl.style.transition = 'opacity 0.3s ease'
  heroEl.style.opacity = '0'
  setTimeout(() => {
    setHero(item)
    heroEl.style.opacity = '1'
  }, 300)
}

/* ═══════════════════════════════════════════════════════
   카테고리 탭 필터 (추천 그리드 + Hero 변경)
═══════════════════════════════════════════════════════ */
window.movionCategory = function(cat) {
  document.querySelectorAll('.cat-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.cat === cat)
    t.setAttribute('aria-selected', t.dataset.cat === cat)
  })
  filterGrid(document.getElementById('recommend-grid'), cat)
}

/* ═══════════════════════════════════════════════════════
   드로어 카테고리 필터
   → Hero 변경 + main-grid + recommend-grid 동시 필터
   → 상단으로 smooth scroll
═══════════════════════════════════════════════════════ */
window.movionFilter = function(type) {
  /* 드로어 active 상태 업데이트 */
  document.querySelectorAll('.drawer-filter-item').forEach(el => {
    el.classList.toggle('active', el.dataset.type === type)
  })

  /* 드로어 닫기 */
  document.getElementById('drawer')?.classList.remove('open')
  document.getElementById('drawer-overlay')?.classList.remove('show')
  document.getElementById('hamburger-btn')?.classList.remove('open')
  document.body.style.overflow = ''

  /* Hero 카테고리에 맞게 교체 */
  updateHeroForCategory(type)

  /* 두 그리드 모두 필터링 */
  filterGrid(document.getElementById('main-grid'), type)
  filterGrid(document.getElementById('recommend-grid'), type)

  /* 상단으로 스크롤 (Hero 변경 확인) */
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/* ═══════════════════════════════════════════════════════
   기분 기반 추천
═══════════════════════════════════════════════════════ */
const MOOD_GENRES = {
  '신나는':       ['액션','어드벤처','코미디'],
  '감성적인':     ['로맨스','뮤지컬','드라마'],
  '생각하게 하는': ['SF','철학','미스터리'],
  '몰입감 있는':   ['스릴러','범죄','공포','서바이벌','역사'],
  '편안한':       ['로맨스','코미디','판타지','애니메이션'],
}

window.movionMood = function(mood) {
  const pills = document.querySelectorAll('.mood-pill')
  const isActive = [...pills].find(p => p.dataset.mood === mood)?.classList.contains('active')

  pills.forEach(p => p.classList.toggle('active', p.dataset.mood === mood && !isActive))

  const hint = document.getElementById('mood-hint')
  const grid = document.getElementById('mood-grid')
  const empty = document.getElementById('mood-empty')

  if (isActive) {
    if (hint) hint.style.display = 'block'
    if (grid) grid.style.display = 'none'
    if (empty) empty.style.display = 'none'
    currentMood = null
    return
  }

  currentMood = mood
  const moodG = MOOD_GENRES[mood] || []
  const matched = allContents.filter(item =>
    (item.mood||[]).includes(mood) || (item.genre||[]).some(g => moodG.includes(g))
  )

  if (hint) hint.style.display = 'none'
  if (matched.length === 0) {
    if (grid) grid.style.display = 'none'
    if (empty) empty.style.display = 'block'
    return
  }
  if (empty) empty.style.display = 'none'
  if (grid) {
    grid.style.display = 'grid'
    grid.innerHTML = matched.slice(0,8).map(cardHTML).join('')
    grid.querySelectorAll('.card').forEach(c => {
      c.addEventListener('click', () => {
        window.location.href = BASE + 'html/detail.html?id=' + c.dataset.id
      })
    })
  }
}

/* ═══════════════════════════════════════════════════════
   검색
═══════════════════════════════════════════════════════ */
function applySearch(query) {
  const grids = ['main-grid','recommend-grid']
  let total = 0
  grids.forEach(id => {
    const grid = document.getElementById(id)
    if (!grid) return
    grid.querySelectorAll('.card[data-category]').forEach(c => {
      if (!query) { c.style.display = 'flex'; c.style.opacity = '1'; total++; return }
      const match = c.dataset.title?.includes(query) || c.dataset.genres?.includes(query)
      c.style.display = match ? 'flex' : 'none'
      c.style.opacity = match ? '1' : '0'
      if (match) total++
    })
  })
  const msg = document.getElementById('search-result-msg')
  if (!msg) return
  if (!query) { msg.style.display = 'none'; return }
  msg.style.display = 'block'
  msg.className = total ? 'search-result-msg' : 'search-result-msg no-result'
  msg.textContent = total ? `"${query}" 검색 결과 ${total}개` : `"${query}"에 대한 검색 결과가 없습니다.`
}

function initSearch() {
  const input = document.getElementById('search-input')
  const clear = document.getElementById('search-clear')
  if (!input) return
  let timer = null
  input.addEventListener('input', () => {
    clearTimeout(timer)
    const q = input.value.trim().toLowerCase()
    if (clear) clear.style.display = q ? 'flex' : 'none'
    timer = setTimeout(() => applySearch(q), 180)
  })
  clear?.addEventListener('click', () => {
    input.value = ''
    clear.style.display = 'none'
    applySearch('')
    input.focus()
  })
  document.querySelectorAll('.search-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      input.value = tag.dataset.genre
      if (clear) clear.style.display = 'flex'
      applySearch(tag.dataset.genre.toLowerCase())
    })
  })
}

/* ═══════════════════════════════════════════════════════
   통계 카운터
═══════════════════════════════════════════════════════ */
function initStatsCounter() {
  const section = document.querySelector('.stats-section')
  if (!section) return
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      entry.target.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count)
        const suffix = el.dataset.suffix || ''
        const start  = performance.now()
        const dur    = 1400
        const tick = now => {
          const p = Math.min((now - start) / dur, 1)
          const e = 1 - Math.pow(1 - p, 3)
          el.textContent = Math.floor(e * target).toLocaleString() + suffix
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      })
      observer.unobserve(entry.target)
    })
  }, { threshold: 0.4 })
  observer.observe(section)
}

/* ═══════════════════════════════════════════════════════
   드래그 스크롤
═══════════════════════════════════════════════════════ */
function enableDragScroll(el) {
  let down = false, startX, sl
  el.addEventListener('mousedown', e => { down=true; el.classList.add('grabbing'); startX=e.pageX-el.offsetLeft; sl=el.scrollLeft })
  el.addEventListener('mouseleave', () => { down=false; el.classList.remove('grabbing') })
  el.addEventListener('mouseup', () => { down=false; el.classList.remove('grabbing') })
  el.addEventListener('mousemove', e => { if(!down) return; e.preventDefault(); el.scrollLeft = sl - (e.pageX - el.offsetLeft - startX)*1.5 })
}

/* ═══════════════════════════════════════════════════════
   TOP 버튼
═══════════════════════════════════════════════════════ */
function initTopBtn() {
  const btn = document.getElementById('top-btn')
  if (!btn) return
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 300), { passive:true })
  btn.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }))
}

/* ═══════════════════════════════════════════════════════
   스크롤 페이드
═══════════════════════════════════════════════════════ */
function initScrollAnimations() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } })
  }, { threshold: 0.07 })
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el))
}

/* ═══════════════════════════════════════════════════════
   초기화
═══════════════════════════════════════════════════════ */
async function init() {
  /* Supabase 데이터 조회 후 mock 데이터로 보완 */
  let supabaseItems = []
  try {
    const { data } = await supabase.from('movion_contents').select('*').order('created_at', { ascending: false })
    supabaseItems = data || []
  } catch (_) {}

  /* Supabase 항목과 mock 항목 병합 (mock을 기반으로, supabase로 보완) */
  const sbTitles = new Set(supabaseItems.map(i => i.title))
  const merged   = [
    ...supabaseItems,
    ...MOCK_CONTENTS.filter(m => !sbTitles.has(m.title)),
  ]

  allContents = merged.map((item, i) => enrichItem(item, i))

  const featured   = allContents.find(c => c.is_featured) || allContents[0]
  const byRating   = [...allContents].sort((a,b) => (Number(b.rating)||0) - (Number(a.rating)||0))
  const bannerItem = byRating.find(c => c.id !== featured?.id) || byRating[0]

  if (featured) { setHero(featured); setDetail(featured) }
  setBanner(bannerItem)

  renderMadeForYou(allContents)
  renderMainGrid(allContents)
  renderRecommendGrid(allContents)

  document.getElementById('modal-close')?.addEventListener('click', closeTrailer)
  document.getElementById('trailer-modal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeTrailer()
  })

  initSearch()
  initStatsCounter()
  initTopBtn()
  initScrollAnimations()
}

init()
