import { supabase } from './supabase.js'
import { signOut } from './auth.js'

const BASE = import.meta.env.BASE_URL

const LINKS = [
  { href: BASE + 'index.html',          icon: '🏠', label: '홈',     id: 'home' },
  { href: BASE + 'html/contents.html',  icon: '🎬', label: '목록',   id: 'contents' },
  { href: BASE + 'html/upload.html',    icon: '➕', label: '등록',   id: 'upload' },
  { href: BASE + 'html/mypage.html',    icon: '👤', label: '마이',   id: 'mypage' },
]

function currentPage() {
  const p = location.pathname
  if (p.endsWith('index.html') || p === BASE || p === BASE.slice(0,-1) + '/') return 'home'
  if (p.includes('contents')) return 'contents'
  if (p.includes('upload'))   return 'upload'
  if (p.includes('mypage'))   return 'mypage'
  if (p.includes('auth'))     return 'auth'
  if (p.includes('detail'))   return 'detail'
  return 'home'
}

function renderSidebar(user) {
  const cur = currentPage()
  return `
    <aside class="sidebar" id="sidebar-el">
      <div class="sidebar-logo">MOVION</div>
      <nav class="sidebar-nav">
        ${LINKS.map(l => `
          <a href="${l.href}" class="${cur === l.id ? 'active' : ''}">
            <span class="nav-icon">${l.icon}</span>${l.label}
          </a>`).join('')}
      </nav>
      <div class="sidebar-bottom">
        ${user
          ? `<div class="sidebar-user">
              <div class="sidebar-user-avatar">${user.email[0].toUpperCase()}</div>
              <div style="flex:1;overflow:hidden">
                <div style="font-size:.8rem;font-weight:600;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${user.email.split('@')[0]}</div>
              </div>
              <button id="logout-btn" style="font-size:.75rem;color:var(--text-muted);cursor:pointer;background:none;border:none">로그아웃</button>
             </div>`
          : `<a href="${BASE}html/auth.html" class="btn btn-primary" style="width:100%;justify-content:center">로그인</a>`
        }
      </div>
    </aside>`
}

function renderBottomNav() {
  const cur = currentPage()
  return `
    <nav class="bottom-nav" id="bottom-nav-el">
      ${LINKS.map(l => `
        <a href="${l.href}" class="${cur === l.id ? 'active' : ''}">
          <span class="tab-icon">${l.icon}</span>${l.label}
        </a>`).join('')}
    </nav>`
}

async function init() {
  const { data: { user } } = await supabase.auth.getUser()

  const sidebarMount = document.getElementById('sidebar')
  if (sidebarMount) sidebarMount.outerHTML = renderSidebar(user)

  const navMount = document.getElementById('bottom-nav')
  if (navMount) navMount.outerHTML = renderBottomNav()

  document.addEventListener('click', e => {
    if (e.target.id === 'logout-btn') signOut()
  })
}

init()
