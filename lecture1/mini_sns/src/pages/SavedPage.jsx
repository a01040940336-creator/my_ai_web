import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Button from '@mui/material/Button'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import TopBar from '../components/TopBar'
import PostCard from '../components/PostCard'
import { useAuth } from '../context/AuthContext'
import { useSavedPosts } from '../hooks/useSavedPosts'
import { sortByDday, getStatusLabel } from '../utils/date'

const STATUS_TABS = ['ALL', 'CLOSING SOON', 'NOW OPEN', 'UPCOMING', 'ENDED']

const SavedPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { savedIds, toggleSave } = useSavedPosts()
  const [savedPosts, setSavedPosts] = useState([])
  const [tab, setTab] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    supabase
      .from('popspot_saves')
      .select('post_id, popspot_posts(*)')
      .eq('user_id', user.id)
      .then(({ data }) => {
        const posts = data?.map(d => d.popspot_posts).filter(Boolean) ?? []
        setSavedPosts(sortByDday(posts))
        setLoading(false)
      })
  }, [user, savedIds]) // savedIds 변경 시 새로고침

  const handleToggleSave = async (postId, e) => {
    await toggleSave(postId, e)
    // 저장 해제 시 목록에서 즉시 제거
    setSavedPosts(prev => prev.filter(p => p.id !== postId || savedIds.has(postId)))
  }

  const filtered = savedPosts.filter(p => {
    if (tab === 0) return true
    return getStatusLabel(p.start_date, p.end_date) === STATUS_TABS[tab]
  })

  const counts = STATUS_TABS.map((s, i) =>
    i === 0 ? savedPosts.length : savedPosts.filter(p => getStatusLabel(p.start_date, p.end_date) === s).length
  )

  if (!user) {
    return (
      <Box sx={{ pb: 10 }}>
        <TopBar title="SAVED" />
        <Box sx={{ pt: 8, px: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <BookmarkBorderIcon sx={{ fontSize: 40, color: '#DDD' }} />
          <Typography variant="body2" sx={{ color: '#999', lineHeight: 1.7 }}>
            로그인하면 마음에 드는 팝업/전시를<br />저장하고 언제든 다시 볼 수 있어요.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/auth')} sx={{ px: 4, py: 1.25, mt: 1 }}>
            로그인하기
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ pb: 10 }}>
      <TopBar title="SAVED" />

      {/* STATUS 탭 */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons={false}
        sx={{
          borderBottom: '1px solid #EAEAEA', minHeight: 40,
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', color: '#AAA', minHeight: 40, px: 1.5 },
          '& .Mui-selected': { color: '#111 !important' },
          '& .MuiTabs-indicator': { bgcolor: '#111', height: 2 },
        }}
      >
        {STATUS_TABS.map((label, i) => (
          <Tab
            key={label}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <span>{label}</span>
                <Box sx={{
                  fontSize: '0.5625rem', bgcolor: tab === i ? '#111' : '#F0F0F0',
                  color: tab === i ? '#fff' : '#999',
                  borderRadius: 10, px: 0.625, fontWeight: 700, lineHeight: 1.8,
                }}>
                  {counts[i]}
                </Box>
              </Box>
            }
          />
        ))}
      </Tabs>

      {loading ? (
        <Box sx={{ pt: 6, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">Loading...</Typography>
        </Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ pt: 8, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
          <BookmarkBorderIcon sx={{ fontSize: 32, color: '#DDD' }} />
          <Typography variant="caption" color="text.secondary">
            {tab === 0 ? '저장한 항목이 없어요. 홈에서 ☆ 를 눌러보세요.' : '해당 상태의 저장 항목이 없어요.'}
          </Typography>
          {tab === 0 && (
            <Button size="small" onClick={() => navigate('/')} sx={{ color: '#888', fontSize: '0.75rem' }}>
              홈으로 탐색하기
            </Button>
          )}
        </Box>
      ) : (
        <Box sx={{ px: 2, pt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          {filtered.map(post => (
            <PostCard
              key={post.id} post={post}
              isSaved={savedIds.has(post.id)}
              onToggleSave={handleToggleSave}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

export default SavedPage
