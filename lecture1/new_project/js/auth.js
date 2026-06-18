import { supabase } from './supabase.js'

const BASE = import.meta.env.BASE_URL

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile(userId) {
  try {
    const { data } = await supabase.from('profiles').select('username, email').eq('id', userId).single()
    return data
  } catch {
    return null
  }
}

export function getSocialUser() {
  try { return JSON.parse(localStorage.getItem('movion_social_user') || 'null') } catch { return null }
}

export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signUp(email, password) {
  return supabase.auth.signUp({ email, password })
}

export async function signOut() {
  await supabase.auth.signOut()
  localStorage.removeItem('movion_social_user')
  window.location.href = BASE + 'html/auth.html'
}

export function requireAuth() {
  Promise.all([
    supabase.auth.getUser(),
  ]).then(([{ data: { user } }]) => {
    const social = getSocialUser()
    if (!user && !social) window.location.href = BASE + 'html/auth.html'
  })
}
