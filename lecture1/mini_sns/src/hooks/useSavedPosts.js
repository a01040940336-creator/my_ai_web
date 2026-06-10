import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'

export const useSavedPosts = () => {
  const { user } = useAuth()
  const [savedIds, setSavedIds] = useState(new Set())

  useEffect(() => {
    if (!user) { setSavedIds(new Set()); return }
    supabase
      .from('popspot_saves')
      .select('post_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setSavedIds(new Set(data?.map(d => d.post_id) || []))
      })
  }, [user])

  const toggleSave = async (postId, e) => {
    e?.stopPropagation()
    if (!user) return false

    if (savedIds.has(postId)) {
      await supabase.from('popspot_saves').delete().eq('post_id', postId).eq('user_id', user.id)
      setSavedIds(prev => { const next = new Set(prev); next.delete(postId); return next })
    } else {
      await supabase.from('popspot_saves').insert({ post_id: postId, user_id: user.id })
      setSavedIds(prev => new Set([...prev, postId]))
    }
    return true
  }

  return { savedIds, toggleSave }
}
