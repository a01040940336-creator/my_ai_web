import { supabase } from './supabase.js'
import { signOut } from './auth.js'

const BASE = import.meta.env.BASE_URL

const MENU = [
  { href: BASE + 'index.html',                    icon: '🏠', label: '홈',         id: 'home' },
  { href: BASE + 'html/contents.html',             icon: '🔥', label: '인기 콘텐츠', id: 'contents' },
  { href: BASE + 'html/contents.html?type=movie',  icon: '🎬', label: '최신 영화',  id: 'movie' },
  { href: BASE + 'html/contents.html?type=drama',  icon: '📺', label: '드라마',     id: 'drama' },
  { href: BASE + 'html/contents.html?type=series', icon: '🎞️', label: '추천 콘텐츠', id: 'series' },
  { href: BASE + 'html/mypage.html',               icon: '👤', label: '마이페이지', id: 'mypage' },
]

const BOTTOM = [
  { href: BASE + 'index.html',           icon: '🏠', label: '홈',     id: 'home' },
  { href: BASE + 'html/contents.html',   icon: '🎬', label: '목록',   id: 'contents' },
  { href: BASE + 'html/upload.html',     icon: '➕', label: '등록',   id: 'upload' },
  { href: BASE + 'html/mypage.html',     icon: '👤', label: '마이',   id: 'mypage' },
]

function currentPage() {
  const p = location.pathname
  const q = new URLSearchParams(location.search)
  if (p.endsWith('index.html') || p === BASE || p.endsWith('/new_project/')) return 'home'
  if (p.includes('mypage'))   return 'mypage'
  if (p.includes('upload'))   return 'upload'
  if (p.includes('auth'))     return 'auth'
  if (p.includes('detail'))   return 'detail'
  if (p.includes('contents')) {
    const t = q.get('type')
    return t || 'contents'
  }
  return 'home'
}

function inject(user) {
  const cur = currentPage()

  // ── 상단 헤더 ──
  const headerEl = document.querySelector('.top-header')
  if (headerEl) {
    headerEl.innerHTML = `
      <button class="hamburger-btn" id="hamburger-btn" aria-label="메뉴 열기">
        <span></span><span></span><span></span>
      </button>
      <a href="${BASE}index.html" class="header-logo">MOVION</a>
      <div style="flex:1"></div>
      ${user
        ? `<span style="font-size:.8rem;color:#aaa;display:none" class="d-md">${user.email.split('@')[0]}</span>
           <button id="header-logout" class="btn btn-ghost btn-sm">로그아웃</button>`
        : `<a href="${BASE}html/auth.html" class="btn btn-primary btn-sm">로그인</a>`
      }`
  }

  // ── 드로어 ──
  const drawerEl = document.getElementById('drawer')
  if (drawerEl) {
    drawerEl.innerHTML = `
      <div class="drawer-header">
        <span class="drawer-logo">MOVION</span>
        <button class="drawer-close" id="drawer-close">✕</button>
      </div>
      <nav class="drawer-nav">
        ${MENU.map(m => `
          <a href="${m.href}" class="${cur === m.id ? 'active' : ''}">
            <span class="d-icon">${m.icon}</span>${m.label}
          </a>`).join('')}
        <div class="drawer-divider"></div>
        <a href="${BASE}html/upload.html" class="${cur === 'upload' ? 'active' : ''}">
          <span class="d-icon">➕</span>콘텐츠 등록
        </a>
        ${cur === 'home' ? `
        <div class="drawer-divider"></div>
        <div class="drawer-section-label">장르 필터</div>
        <button class="drawer-filter-item active" data-type="all"     onclick="window.movionFilter?.('all')">전체</button>
        <button class="drawer-filter-item"         data-type="movie"  onclick="window.movionFilter?.('movie')">🎬 영화</button>
        <button class="drawer-filter-item"         data-type="drama"  onclick="window.movionFilter?.('drama')">📺 드라마</button>
        <button class="drawer-filter-item"         data-type="series" onclick="window.movionFilter?.('series')">🎞️ 시리즈</button>
        ` : ''}
      </nav>
      <div class="drawer-bottom">
        ${user
          ? `<div class="drawer-user">
              <div class="drawer-avatar">${user.email[0].toUpperCase()}</div>
              <div style="flex:1;min-width:0">
                <div style="font-size:.8rem;font-weight:600;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${user.email.split('@')[0]}</div>
                <div style="font-size:.72rem;color:#555">로그인됨</div>
              </div>
              <button id="drawer-logout" style="font-size:.72rem;color:#666;background:none;border:none;cursor:pointer">로그아웃</button>
             </div>`
          : `<a href="${BASE}html/auth.html" class="btn btn-primary" style="width:100%;justify-content:center">로그인 / 가입</a>`
        }
      </div>`
  }

  // ── 하단 탭바 ──
  const bottomEl = document.getElementById('bottom-nav')
  if (bottomEl) {
    bottomEl.innerHTML = BOTTOM.map(b => `
      <a href="${b.href}" class="${cur === b.id ? 'active' : ''}">
        <span class="tab-icon">${b.icon}</span>${b.label}
      </a>`).join('')
  }

  // ── 이벤트 ──
  const burger = document.getElementById('hamburger-btn')
  const drawer = document.getElementById('drawer')
  const overlay = document.getElementById('drawer-overlay')
  const closeBtn = document.getElementById('drawer-close')

  function openDrawer() {
    drawer?.classList.add('open')
    overlay?.classList.add('show')
    burger?.classList.add('open')
    document.body.style.overflow = 'hidden'
  }
  function closeDrawer() {
    drawer?.classList.remove('open')
    overlay?.classList.remove('show')
    burger?.classList.remove('open')
    document.body.style.overflow = ''
  }

  burger?.addEventListener('click', () => {
    drawer?.classList.contains('open') ? closeDrawer() : openDrawer()
  })
  closeBtn?.addEventListener('click', closeDrawer)
  overlay?.addEventListener('click', closeDrawer)

  document.getElementById('header-logout')?.addEventListener('click', signOut)
  document.getElementById('drawer-logout')?.addEventListener('click', signOut)
}

async function init() {
  const { data: { user } } = await supabase.auth.getUser()

  // 드로어 + 오버레이 마운트 (body에 삽입)
  if (!document.getElementById('drawer')) {
    const d = document.createElement('div')
    d.className = 'drawer'
    d.id = 'drawer'
    document.body.appendChild(d)
  }
  if (!document.getElementById('drawer-overlay')) {
    const o = document.createElement('div')
    o.className = 'drawer-overlay'
    o.id = 'drawer-overlay'
    document.body.appendChild(o)
  }

  inject(user)
}

init()
