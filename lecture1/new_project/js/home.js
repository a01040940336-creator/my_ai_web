import { supabase } from './supabase.js'
import { getUser } from './auth.js'
import { showToast, formatType } from './utils.js'

const BASE = import.meta.env.BASE_URL

function cardHTML(item) {
  return `
    <div class="card" data-id="${item.id}">
      <img src="${item.thumbnail_url || ''}" alt="${item.title}" loading="lazy">
      <h3>${item.title}</h3>
      <p>${(item.genre || []).slice(0, 2).join(' / ') || formatType(item.type)}</p>
    </div>`
}

function openTrailer(url) {
  if (!url) { showToast('예고편 준비 중입니다'); return }
  document.getElementById('trailer-iframe').src = url + '?autoplay=1'
  document.getElementById('trailer-modal').style.display = 'flex'
}

function closeTrailer() {
  document.getElementById('trailer-modal').style.display = 'none'
  document.getElementById('trailer-iframe').src = ''
}

async function addToWatchlist(contentId) {
  const user = await getUser()
  if (!user) { showToast('로그인 후 저장할 수 있습니다'); return }

  const { data: existing } = await supabase
    .from('movion_watchlist')
    .select('id').eq('user_id', user.id).eq('content_id', contentId).single()

  if (existing) {
    showToast('이미 저장된 콘텐츠입니다')
  } else {
    await supabase.from('movion_watchlist').insert({ user_id: user.id, content_id: contentId })
    showToast('마이페이지에 저장했습니다! 🎬')
  }
}

function setHero(item) {
  document.getElementById('hero-img').src = item.backdrop_url || item.thumbnail_url || ''
  document.getElementById('hero-label').textContent =
    formatType(item.type) + ' · ' + (item.genre || []).slice(0, 2).join(' · ')
  document.getElementById('hero-title').textContent = item.title
  document.getElementById('hero-desc').textContent = item.description || ''

  document.getElementById('hero-play-btn').onclick = () => openTrailer(item.trailer_url)
  document.getElementById('hero-save-btn').onclick = () => addToWatchlist(item.id)
}

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

function fillGrid(id, items) {
  const grid = document.getElementById(id)
  if (!grid) return
  grid.innerHTML = items.map(cardHTML).join('')
  grid.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      window.location.href = BASE + 'html/detail.html?id=' + card.dataset.id
    })
  })
}

async function init() {
  const { data, error } = await supabase
    .from('movion_contents').select('*').order('created_at', { ascending: false })

  if (error) { showToast('콘텐츠를 불러올 수 없습니다'); return }
  const all = data || []

  const featured = all.find(c => c.is_featured) || all[0]
  if (featured) { setHero(featured); setDetailCard(featured) }

  fillGrid('main-grid', all.slice(0, 6))
  fillGrid('recommend-grid', all.filter(c => c.id !== featured?.id).slice(0, 4))

  document.getElementById('modal-close').addEventListener('click', closeTrailer)
  document.getElementById('trailer-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeTrailer()
  })
}

init()
