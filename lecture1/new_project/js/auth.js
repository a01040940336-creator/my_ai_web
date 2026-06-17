import { supabase } from './supabase.js'

const BASE = import.meta.env.BASE_URL

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  return { data, error }
}

export async function signOut() {
  await supabase.auth.signOut()
  window.location.href = BASE + 'html/auth.html'
}

export function requireAuth(redirectUrl) {
  supabase.auth.getUser().then(({ data: { user } }) => {
    if (!user) {
      window.location.href = BASE + 'html/auth.html'
    }
  })
}

export function updateNavUser() {
  supabase.auth.getUser().then(({ data: { user } }) => {
    const loginBtn = document.getElementById('nav-login-btn')
    const userEl = document.getElementById('nav-user')
    if (!loginBtn || !userEl) return
    if (user) {
      loginBtn.style.display = 'none'
      userEl.style.display = 'flex'
      const emailEl = document.getElementById('nav-user-email')
      if (emailEl) emailEl.textContent = user.email.split('@')[0]
    } else {
      loginBtn.style.display = 'flex'
      userEl.style.display = 'none'
    }
  })
}
