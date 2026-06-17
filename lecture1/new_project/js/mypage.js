import { supabase } from './supabase.js'
import { getUser, signOut } from './auth.js'
import { showToast, formatType } from './utils.js'

const BASE = import.meta.env.BASE_URL
const root = document.getElementById('mypage-content')

function renderLoginPrompt() {
  root.innerHTML = `
    <div class="login-prompt">
      <div class="login-prompt-icon">🔐</div>
      <h2>로그인이 필요합니다</h2>
      <p>마이페이지를 이용하려면 로그인해주세요</p>
      <a href="${BASE}html/auth.html" class="btn btn-primary btn-lg">로그인 / 회원가입</a>
    </div>`
}

async function removeFromWatchlist(wlId, cardEl) {
  const { error } = await supabase.from('movion_watchlist').delete().eq('id', wlId)
  if (!error) {
    cardEl.remove()
    showToast('찜 목록에서 제거했습니다')
    const grid = document.getElementById('watchlist-grid')
    if (grid && grid.children.length === 0) {
      grid.innerHTML = '<p style="color:var(--text-muted);font-size:.875rem;padding:8px 0;grid-column:1/-1">찜한 콘텐츠가 없습니다</p>'
    }
  }
}

function watchlistCardHTML(wl) {
  const c = wl.movion_contents
  if (!c) return ''
  return `
    <div class="watchlist-card" data-id="${c.id}" data-wlid="${wl.id}">
      <img src="${c.thumbnail_url || ''}" alt="${c.title}" loading="lazy">
      <button class="watchlist-remove" title="찜 해제">✕</button>
      <div class="watchlist-card-info">
        <div class="watchlist-card-title">${c.title}</div>
        <div style="font-size:.7rem;color:var(--text-muted)">${formatType(c.type)} · ⭐${c.rating}</div>
      </div>
    </div>`
}

async function renderMyPage(user) {
  const { data: watchlist } = await supabase
    .from('movion_watchlist')
    .select('id, added_at, movion_contents(*)')
    .eq('user_id', user.id)
    .order('added_at', { ascending: false })

  const wl = watchlist || []
  const since = new Date(user.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })

  root.innerHTML = `
    <!-- 프로필 카드 -->
    <div class="profile-card fade-in">
      <div class="profile-avatar">${user.email[0].toUpperCase()}</div>
      <div class="profile-info">
        <div class="profile-email">${user.email}</div>
        <div class="profile-since">가입일: ${since}</div>
      </div>
      <button class="logout-btn-profile" id="logout-btn">로그아웃</button>
    </div>

    <!-- 통계 -->
    <div class="stats-row fade-in">
      <div class="stat-card">
        <div class="stat-value">${wl.length}</div>
        <div class="stat-label">찜한 콘텐츠</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${wl.filter(w => w.movion_contents?.type === 'movie').length}</div>
        <div class="stat-label">찜한 영화</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${wl.filter(w => w.movion_contents?.type !== 'movie').length}</div>
        <div class="stat-label">찜한 드라마</div>
      </div>
    </div>

    <!-- 찜 목록 -->
    <h2 class="section-title">찜한 콘텐츠</h2>
    <div class="watchlist-grid" id="watchlist-grid">
      ${wl.length
        ? wl.map(watchlistCardHTML).join('')
        : '<p style="color:var(--text-muted);font-size:.875rem;padding:8px 0;grid-column:1/-1">아직 찜한 콘텐츠가 없습니다.<br>마음에 드는 콘텐츠를 찜해보세요! 🎬</p>'
      }
    </div>`

  document.getElementById('logout-btn').addEventListener('click', signOut)

  document.querySelectorAll('.watchlist-card').forEach(card => {
    card.querySelector('.watchlist-remove').addEventListener('click', e => {
      e.stopPropagation()
      removeFromWatchlist(card.dataset.wlid, card)
    })
    card.addEventListener('click', e => {
      if (e.target.closest('.watchlist-remove')) return
      window.location.href = BASE + 'html/detail.html?id=' + card.dataset.id
    })
  })
}

async function init() {
  const user = await getUser()
  if (!user) { renderLoginPrompt(); return }
  renderMyPage(user)
}

init()
