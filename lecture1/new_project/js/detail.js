import { supabase } from './supabase.js'
import { getUser } from './auth.js'
import { showToast, formatType, formatGenres, getParam } from './utils.js'

const BASE = import.meta.env.BASE_URL
const contentId = getParam('id')

async function toggleWatchlist(contentId, btn) {
  const user = await getUser()
  if (!user) { showToast('로그인이 필요합니다'); window.location.href = BASE + 'html/auth.html'; return }

  const { data: existing } = await supabase
    .from('movion_watchlist')
    .select('id')
    .eq('user_id', user.id)
    .eq('content_id', contentId)
    .single()

  if (existing) {
    await supabase.from('movion_watchlist').delete().eq('id', existing.id)
    btn.classList.remove('watchlist-added')
    btn.textContent = '+ 찜하기'
    showToast('찜 목록에서 제거했습니다')
  } else {
    await supabase.from('movion_watchlist').insert({ user_id: user.id, content_id: contentId })
    btn.classList.add('watchlist-added')
    btn.textContent = '✓ 찜 완료'
    showToast('찜 목록에 추가했습니다! 🎬')
  }
}

function openTrailer(url) {
  if (!url) { showToast('예고편 준비 중입니다'); return }
  const modal = document.getElementById('trailer-modal')
  document.getElementById('trailer-iframe').src = url + '?autoplay=1'
  modal.style.display = 'flex'
}

function renderDetail(item, isWatchlisted) {
  const main = document.getElementById('detail-main')
  main.innerHTML = `
    <!-- 배경 배너 -->
    <div class="detail-backdrop">
      <img src="${item.backdrop_url || item.thumbnail_url}" alt="${item.title}">
      <div class="detail-backdrop-gradient"></div>
      <button class="detail-back-btn" onclick="history.back()">← 뒤로</button>
    </div>

    <!-- 본문 -->
    <div class="detail-body">
      <div class="container">
        <div class="detail-main">
          <!-- 포스터 -->
          <div class="detail-poster">
            <img src="${item.thumbnail_url}" alt="${item.title}">
          </div>
          <!-- 정보 -->
          <div class="detail-info fade-in">
            <div class="detail-badges">
              <span class="badge badge-type">${formatType(item.type)}</span>
              ${(item.genre || []).map(g => `<span class="badge badge-genre">${g}</span>`).join('')}
            </div>
            <h1 class="detail-title">${item.title}</h1>
            <div class="detail-meta-row">
              <div class="detail-meta-item">
                <span class="detail-meta-label">평점</span>
                <span class="detail-meta-value">⭐ ${item.rating}</span>
              </div>
              <div class="detail-meta-item">
                <span class="detail-meta-label">출시연도</span>
                <span class="detail-meta-value">${item.release_year}</span>
              </div>
              <div class="detail-meta-item">
                <span class="detail-meta-label">${item.type === 'movie' ? '러닝타임' : '편당 시간'}</span>
                <span class="detail-meta-value">${item.duration || '-'}</span>
              </div>
              ${item.episodes ? `<div class="detail-meta-item">
                <span class="detail-meta-label">에피소드</span>
                <span class="detail-meta-value">${item.episodes}회</span>
              </div>` : ''}
            </div>
            <div class="detail-actions">
              <button class="btn btn-primary btn-lg" id="play-btn">▶ 예고편 보기</button>
              <button class="btn btn-outline btn-lg ${isWatchlisted ? 'watchlist-added' : ''}" id="watchlist-btn">
                ${isWatchlisted ? '✓ 찜 완료' : '+ 찜하기'}
              </button>
            </div>
          </div>
        </div>

        <!-- 줄거리 -->
        <div class="detail-desc-section">
          <p class="detail-desc-title">줄거리</p>
          <p class="detail-desc">${item.description || '줄거리 정보가 없습니다.'}</p>
        </div>
      </div>
    </div>`

  document.getElementById('play-btn').addEventListener('click', () => openTrailer(item.trailer_url))
  document.getElementById('watchlist-btn').addEventListener('click', function() {
    toggleWatchlist(item.id, this)
  })
  document.getElementById('modal-close').addEventListener('click', () => {
    document.getElementById('trailer-modal').style.display = 'none'
    document.getElementById('trailer-iframe').src = ''
  })
  document.getElementById('trailer-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) {
      document.getElementById('trailer-modal').style.display = 'none'
      document.getElementById('trailer-iframe').src = ''
    }
  })
}

async function init() {
  if (!contentId) { window.location.href = BASE + 'html/contents.html'; return }

  const [{ data: item, error }, user] = await Promise.all([
    supabase.from('movion_contents').select('*').eq('id', contentId).single(),
    getUser()
  ])
  if (error || !item) { showToast('콘텐츠를 찾을 수 없습니다'); window.location.href = BASE + 'html/contents.html'; return }

  document.title = `MOVION - ${item.title}`

  let isWatchlisted = false
  if (user) {
    const { data } = await supabase.from('movion_watchlist').select('id').eq('user_id', user.id).eq('content_id', contentId).single()
    isWatchlisted = !!data
  }

  renderDetail(item, isWatchlisted)
}

init()
