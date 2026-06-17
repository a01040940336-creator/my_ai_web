import { signIn, signUp, getUser } from './auth.js'
import { showToast } from './utils.js'

const BASE = import.meta.env.BASE_URL

// 이미 로그인된 경우 홈으로
getUser().then(user => {
  if (user) window.location.href = BASE + 'index.html'
})

const tabLogin  = document.getElementById('tab-login')
const tabSignup = document.getElementById('tab-signup')
const loginForm  = document.getElementById('login-form')
const signupForm = document.getElementById('signup-form')

function switchTab(isLogin) {
  loginForm.style.display  = isLogin ? '' : 'none'
  signupForm.style.display = isLogin ? 'none' : ''
  tabLogin.classList.toggle('active', isLogin)
  tabSignup.classList.toggle('active', !isLogin)
}

tabLogin.addEventListener('click',  () => switchTab(true))
tabSignup.addEventListener('click', () => switchTab(false))

loginForm.addEventListener('submit', async e => {
  e.preventDefault()
  const email = document.getElementById('login-email').value.trim()
  const pw    = document.getElementById('login-pw').value
  const errEl = document.getElementById('login-error')
  const btn   = document.getElementById('login-btn')

  btn.disabled = true
  btn.textContent = '로그인 중...'
  errEl.classList.remove('show')

  const { error } = await signIn(email, pw)
  if (error) {
    errEl.textContent = '이메일 또는 비밀번호가 올바르지 않습니다'
    errEl.classList.add('show')
    btn.disabled = false
    btn.textContent = '로그인'
  } else {
    showToast('로그인 되었습니다!')
    setTimeout(() => { window.location.href = BASE + 'index.html' }, 800)
  }
})

signupForm.addEventListener('submit', async e => {
  e.preventDefault()
  const email = document.getElementById('signup-email').value.trim()
  const pw    = document.getElementById('signup-pw').value
  const pw2   = document.getElementById('signup-pw2').value
  const errEl = document.getElementById('signup-error')
  const btn   = document.getElementById('signup-btn')

  errEl.classList.remove('show')

  if (pw !== pw2) {
    errEl.textContent = '비밀번호가 일치하지 않습니다'
    errEl.classList.add('show')
    return
  }

  btn.disabled = true
  btn.textContent = '가입 중...'

  const { error } = await signUp(email, pw)
  if (error) {
    errEl.textContent = error.message || '회원가입에 실패했습니다'
    errEl.classList.add('show')
    btn.disabled = false
    btn.textContent = '회원가입'
  } else {
    showToast('가입 완료! 이메일을 확인해주세요 📧')
    setTimeout(() => switchTab(true), 1500)
    btn.disabled = false
    btn.textContent = '회원가입'
  }
})
