import { supabase } from './supabase.js'
import { requireAuth, getUser } from './auth.js'
import { showToast } from './utils.js'

const BASE = import.meta.env.BASE_URL
requireAuth()

const UNSPLASH_QUERIES = [
  'cinema dark film',
  'movie theater night',
  'dramatic portrait',
  'dark city night',
  'science fiction space',
  'thriller mystery dark',
  'romance evening',
  'fantasy adventure',
]

let selectedGenres = []

// 타입 변경 시 에피소드 필드 표시
document.getElementById('f-type').addEventListener('change', function() {
  const ep = document.getElementById('episodes-group')
  ep.style.display = (this.value === 'drama' || this.value === 'series') ? '' : 'none'
})

// 장르 태그 토글
document.querySelectorAll('.genre-tag').forEach(tag => {
  tag.addEventListener('click', () => {
    const g = tag.dataset.genre
    if (selectedGenres.includes(g)) {
      selectedGenres = selectedGenres.filter(x => x !== g)
      tag.classList.remove('selected')
    } else {
      selectedGenres.push(g)
      tag.classList.add('selected')
    }
  })
})

// 랜덤 이미지 (Unsplash)
document.getElementById('random-btn').addEventListener('click', () => {
  const query = UNSPLASH_QUERIES[Math.floor(Math.random() * UNSPLASH_QUERIES.length)]
  const seed  = Math.floor(Math.random() * 1000)
  const url   = `https://images.unsplash.com/photo-${seed}?w=400&q=80&sig=${seed}&auto=format&fit=crop&q=80&w=400`
  // Unsplash random by topic
  const topics = ['movie','cinema','film','drama','night','dark','portrait','space']
  const topic  = topics[Math.floor(Math.random() * topics.length)]
  const finalUrl = `https://source.unsplash.com/random/400x600/?${topic},${Math.random()}`
  document.getElementById('f-thumb').value = finalUrl
  const prev = document.getElementById('thumb-preview')
  prev.src = finalUrl
  prev.classList.add('show')
})

// 썸네일 URL 직접 입력 시 미리보기
document.getElementById('f-thumb').addEventListener('input', function() {
  const prev = document.getElementById('thumb-preview')
  if (this.value) {
    prev.src = this.value
    prev.classList.add('show')
  } else {
    prev.classList.remove('show')
  }
})

// 폼 제출
document.getElementById('upload-form').addEventListener('submit', async e => {
  e.preventDefault()
  const user = await getUser()
  if (!user) { showToast('로그인이 필요합니다'); return }

  const btn = document.getElementById('submit-btn')
  btn.disabled = true
  btn.textContent = '등록 중...'

  const type = document.getElementById('f-type').value
  const payload = {
    title:         document.getElementById('f-title').value.trim(),
    description:   document.getElementById('f-desc').value.trim(),
    thumbnail_url: document.getElementById('f-thumb').value.trim() || null,
    backdrop_url:  document.getElementById('f-backdrop').value.trim() || null,
    trailer_url:   document.getElementById('f-trailer').value.trim() || null,
    genre:         selectedGenres.length ? selectedGenres : null,
    type:          type || null,
    rating:        document.getElementById('f-rating').value ? parseFloat(document.getElementById('f-rating').value) : null,
    release_year:  document.getElementById('f-year').value ? parseInt(document.getElementById('f-year').value) : null,
    duration:      document.getElementById('f-duration').value.trim() || null,
    episodes:      document.getElementById('f-episodes').value ? parseInt(document.getElementById('f-episodes').value) : null,
    is_featured:   document.getElementById('f-featured').checked,
  }

  const { error } = await supabase.from('movion_contents').insert(payload)
  if (error) {
    showToast('등록에 실패했습니다: ' + error.message)
    btn.disabled = false
    btn.textContent = '등록하기'
  } else {
    showToast('콘텐츠가 등록되었습니다! 🎬')
    setTimeout(() => { window.location.href = BASE + 'html/contents.html' }, 1000)
  }
})
