import { supabase } from './supabase.js'
import { showToast } from './utils.js'

const BASE = import.meta.env.BASE_URL

/* ── 로그인 상태면 홈으로 ── */
;(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) window.location.href = BASE + 'index.html'
  const social = getSocialUser()
  if (social) window.location.href = BASE + 'index.html'
})()

/* ── 소셜 사용자 localStorage 유틸 ── */
function getSocialUser() {
  try { return JSON.parse(localStorage.getItem('movion_social_user') || 'null') } catch { return null }
}
function setSocialUser(u) {
  localStorage.setItem('movion_social_user', JSON.stringify(u))
}

/* ── 탭 전환 ── */
const tabLogin  = document.getElementById('tab-login')
const tabSignup = document.getElementById('tab-signup')
const loginForm  = document.getElementById('login-form')
const signupForm = document.getElementById('signup-form')

function switchTab(isLogin) {
  loginForm.style.display  = isLogin ? '' : 'none'
  signupForm.style.display = isLogin ? 'none' : ''
  tabLogin.classList.toggle('active', isLogin)
  tabSignup.classList.toggle('active', !isLogin)
  clearErrors()
}
tabLogin.addEventListener('click',  () => switchTab(true))
tabSignup.addEventListener('click', () => switchTab(false))

function clearErrors() {
  document.querySelectorAll('.form-error, .field-error, .field-msg').forEach(el => {
    el.textContent = ''
    el.className = el.className.replace(/\b(show|ok|error)\b/g, '').trim()
  })
}

/* ── 비밀번호 표시/숨기기 ── */
document.querySelectorAll('.pw-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const inp = document.getElementById(btn.dataset.target)
    inp.type = inp.type === 'password' ? 'text' : 'password'
  })
})

/* ── 이메일 형식 검증 ── */
function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

/* ── 아이디 형식 검증 ── */
function isValidUsername(v) {
  return /^[a-zA-Z0-9가-힣_]{3,20}$/.test(v)
}

/* ── 비밀번호 강도 바 ── */
document.getElementById('signup-pw')?.addEventListener('input', e => {
  const v = e.target.value
  const fill = document.getElementById('pw-strength-fill')
  if (!fill) return
  let strength = 0
  if (v.length >= 6) strength++
  if (v.length >= 10) strength++
  if (/[A-Z]/.test(v)) strength++
  if (/[0-9]/.test(v)) strength++
  if (/[^A-Za-z0-9]/.test(v)) strength++
  const pct = Math.min(strength * 20, 100)
  fill.style.width = pct + '%'
  fill.style.background = pct < 40 ? '#ef4444' : pct < 70 ? '#f59e0b' : '#22c55e'
})

/* ── 아이디 중복 확인 ── */
let usernameChecked = false

document.getElementById('username-check-btn')?.addEventListener('click', async () => {
  const username = document.getElementById('signup-username').value.trim()
  const msgEl = document.getElementById('msg-username')
  usernameChecked = false

  if (!username) {
    msgEl.textContent = '아이디를 입력해주세요'
    msgEl.className = 'field-msg error'
    return
  }
  if (!isValidUsername(username)) {
    msgEl.textContent = '3~20자, 영문·숫자·한글·언더바만 사용 가능합니다'
    msgEl.className = 'field-msg error'
    return
  }

  const btn = document.getElementById('username-check-btn')
  btn.disabled = true
  btn.textContent = '확인 중...'

  try {
    const { data } = await supabase
      .from('profiles').select('id').eq('username', username).maybeSingle()

    if (data) {
      msgEl.textContent = '이미 사용 중인 아이디입니다'
      msgEl.className = 'field-msg error'
    } else {
      msgEl.textContent = '사용 가능한 아이디입니다 ✓'
      msgEl.className = 'field-msg ok'
      usernameChecked = true
    }
  } catch {
    msgEl.textContent = '확인 중 오류가 발생했습니다'
    msgEl.className = 'field-msg error'
  } finally {
    btn.disabled = false
    btn.textContent = '중복확인'
  }
})

/* 아이디 변경 시 중복확인 초기화 */
document.getElementById('signup-username')?.addEventListener('input', () => {
  usernameChecked = false
  const msgEl = document.getElementById('msg-username')
  if (msgEl) { msgEl.textContent = ''; msgEl.className = 'field-msg' }
})

/* ── 로그인 ── */
loginForm.addEventListener('submit', async e => {
  e.preventDefault()
  const email = document.getElementById('login-email').value.trim()
  const pw    = document.getElementById('login-pw').value
  const errEl = document.getElementById('login-error')
  const btn   = document.getElementById('login-btn')

  errEl.textContent = ''

  if (!isValidEmail(email)) {
    errEl.textContent = '올바른 이메일 형식을 입력하세요'
    errEl.className = 'form-error show'
    return
  }
  if (!pw) {
    errEl.textContent = '비밀번호를 입력하세요'
    errEl.className = 'form-error show'
    return
  }

  btn.disabled = true
  btn.textContent = '로그인 중...'
  errEl.className = 'form-error'

  const { error } = await supabase.auth.signInWithPassword({ email, password: pw })
  if (error) {
    const msg = error.message.includes('Invalid') || error.message.includes('invalid')
      ? '이메일 또는 비밀번호가 올바르지 않습니다'
      : '로그인에 실패했습니다. 다시 시도해주세요'
    errEl.textContent = msg
    errEl.className = 'form-error show'
    btn.disabled = false
    btn.textContent = '로그인'
  } else {
    showToast('로그인 성공! 환영합니다 🎬')
    setTimeout(() => { window.location.href = BASE + 'index.html' }, 800)
  }
})

/* ── 회원가입 ── */
signupForm.addEventListener('submit', async e => {
  e.preventDefault()
  const email    = document.getElementById('signup-email').value.trim()
  const username = document.getElementById('signup-username').value.trim()
  const pw       = document.getElementById('signup-pw').value
  const pw2      = document.getElementById('signup-pw2').value
  const errEl    = document.getElementById('signup-error')
  const btn      = document.getElementById('signup-btn')

  /* 모든 에러 초기화 */
  document.getElementById('err-email').textContent  = ''
  document.getElementById('err-pw').textContent     = ''
  document.getElementById('err-pw2').textContent    = ''
  errEl.className = 'form-error'

  let hasError = false

  if (!isValidEmail(email)) {
    document.getElementById('err-email').textContent = '올바른 이메일 형식을 입력하세요'
    document.getElementById('err-email').className = 'field-error show'
    hasError = true
  }
  if (!isValidUsername(username)) {
    const msgEl = document.getElementById('msg-username')
    msgEl.textContent = '3~20자, 영문·숫자·한글·언더바만 사용 가능합니다'
    msgEl.className = 'field-msg error'
    hasError = true
  } else if (!usernameChecked) {
    const msgEl = document.getElementById('msg-username')
    msgEl.textContent = '아이디 중복확인을 완료해주세요'
    msgEl.className = 'field-msg error'
    hasError = true
  }
  if (pw.length < 6) {
    document.getElementById('err-pw').textContent = '비밀번호는 6자 이상이어야 합니다'
    document.getElementById('err-pw').className = 'field-error show'
    hasError = true
  }
  if (pw !== pw2) {
    document.getElementById('err-pw2').textContent = '비밀번호가 일치하지 않습니다'
    document.getElementById('err-pw2').className = 'field-error show'
    hasError = true
  }
  if (hasError) return

  btn.disabled = true
  btn.textContent = '가입 중...'

  /* 1. Supabase Auth 회원가입 */
  const { data, error } = await supabase.auth.signUp({ email, password: pw })

  if (error) {
    const msg = error.message.includes('already')
      ? '이미 사용 중인 이메일입니다'
      : error.message || '회원가입에 실패했습니다'
    errEl.textContent = msg
    errEl.className = 'form-error show'
    btn.disabled = false
    btn.textContent = '회원가입'
    return
  }

  /* 2. profiles 테이블에 username 저장 */
  if (data.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      username,
      email,
      created_at: new Date().toISOString(),
    }, { onConflict: 'id' })
  }

  showToast('가입 완료! 이메일 인증 후 로그인해주세요 📧')
  setTimeout(() => {
    switchTab(true)
    document.getElementById('login-email').value = email
  }, 1500)
  btn.disabled = false
  btn.textContent = '회원가입'
})

/* ── 소셜 로그인 ── */

/* Google (Supabase OAuth) */
document.getElementById('btn-google')?.addEventListener('click', async () => {
  const btn = document.getElementById('btn-google')
  btn.disabled = true
  btn.textContent = 'Google 연결 중...'

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + BASE + 'index.html' },
  })
  if (error) {
    showToast('Google 로그인을 사용할 수 없습니다')
    btn.disabled = false
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> Google로 로그인`
  }
})

/* 소셜 시뮬레이션 공통 함수 */
async function simulateSocialLogin(provider, username, btnEl, originalHTML) {
  btnEl.disabled = true
  btnEl.textContent = '로그인 중...'

  await new Promise(r => setTimeout(r, 1200))

  setSocialUser({ provider, username, email: `${provider}_demo@movion.app` })
  showToast(`${provider === 'naver' ? '네이버' : '카카오'} 로그인 성공! 환영합니다 🎉`)
  setTimeout(() => { window.location.href = BASE + 'index.html' }, 800)
}

/* Naver */
document.getElementById('btn-naver')?.addEventListener('click', function() {
  simulateSocialLogin('naver', '네이버사용자', this, this.innerHTML)
})

/* Kakao */
document.getElementById('btn-kakao')?.addEventListener('click', function() {
  simulateSocialLogin('kakao', '카카오사용자', this, this.innerHTML)
})
