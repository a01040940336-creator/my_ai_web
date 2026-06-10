import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Avatar from '@mui/material/Avatar'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'
import PostCard from '../components/PostCard'
import TopBar from '../components/TopBar'
import { differenceInDays } from '../utils/date'

const MyPage = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)
  const [saved, setSaved] = useState([])
  const [liked, setLiked] = useState([])

  useEffect(() => {
    if (user) {
      fetchSaved()
      fetchLiked()
    }
  }, [user])

  const fetchSaved = async () => {
    const { data } = await supabase
      .from('popspot_saves')
      .select('post_id, popspot_posts(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setSaved(data?.map(d => d.popspot_posts).filter(Boolean) || [])
  }

  const fetchLiked = async () => {
    const { data } = await supabase
      .from('popspot_likes')
      .select('post_id, popspot_posts(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setLiked(data?.map(d => d.popspot_posts).filter(Boolean) || [])
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (!user) {
    return (
      <Box sx={{ pb: 10 }}>
        <TopBar title="마이페이지" />
        <Box sx={{ px: 2.5, pt: 6, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
            로그인하면 저장한 팝업/전시를
            <br />모아볼 수 있어요.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/auth')} sx={{ px: 4, py: 1.25 }}>
            로그인 / 회원가입
          </Button>
        </Box>
      </Box>
    )
  }

  const currentList = tab === 0 ? saved : liked

  const getStatusLabel = (post) => {
    const d = differenceInDays(post.end_date)
    if (d < 0) return '종료'
    if (d === 0) return 'TODAY'
    if (d <= 3) return `D-${d}`
    return '진행중'
  }

  return (
    <Box sx={{ pb: 10 }}>
      <TopBar title="마이페이지" />

      {/* 프로필 영역 */}
      <Box sx={{ px: 2.5, py: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ width: 52, height: 52, bgcolor: '#111', fontSize: '1.25rem' }}>
          {user.email?.[0]?.toUpperCase()}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>{user.email}</Typography>
          <Typography variant="caption" color="text.secondary">POP SPOT 멤버</Typography>
        </Box>
        <Button variant="outlined" size="small" onClick={handleSignOut} sx={{ fontSize: '0.75rem' }}>
          로그아웃
        </Button>
      </Box>

      {/* 게시물 작성 버튼 */}
      <Box sx={{ px: 2.5, mb: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate('/write')}
          sx={{ py: 1.25, fontWeight: 600 }}
        >
          + 팝업/전시 등록하기
        </Button>
      </Box>

      {/* 탭 */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          borderBottom: '1px solid #EAEAEA',
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.875rem', color: '#999' },
          '& .Mui-selected': { color: '#111 !important' },
          '& .MuiTabs-indicator': { bgcolor: '#111' },
        }}
      >
        <Tab label={`저장 ${saved.length}`} />
        <Tab label={`좋아요 ${liked.length}`} />
      </Tabs>

      {/* 목록 */}
      <Box sx={{ px: 2, pt: 2 }}>
        {currentList.length === 0 ? (
          <Box sx={{ pt: 6, textAlign: 'center' }}>
            <Typography color="text.secondary">
              {tab === 0 ? '저장한 팝업/전시가 없어요.' : '좋아요한 팝업/전시가 없어요.'}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            {currentList.map(post => (
              <PostCard key={post.id} post={post} compact />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default MyPage
