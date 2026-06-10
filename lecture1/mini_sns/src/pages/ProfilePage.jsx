import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import TopBar from '../components/TopBar'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabase'

const StatBox = ({ label, value }) => (
  <Box sx={{ textAlign: 'center', flex: 1 }}>
    <Typography sx={{ fontWeight: 800, fontSize: '1.375rem', lineHeight: 1.2 }}>{value}</Typography>
    <Typography variant="caption" sx={{ color: '#999', letterSpacing: '0.04em' }}>{label}</Typography>
  </Box>
)

const ProfilePage = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ saved: 0, liked: 0 })

  useEffect(() => {
    if (!user) return
    Promise.all([
      supabase.from('popspot_saves').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('popspot_likes').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    ]).then(([s, l]) => setStats({ saved: s.count ?? 0, liked: l.count ?? 0 }))
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (!user) {
    return (
      <Box sx={{ pb: 10 }}>
        <TopBar title="PROFILE" />
        <Box sx={{ pt: 8, px: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: '#EAEAEA', color: '#AAA', fontSize: '1.75rem' }}>?</Avatar>
          <Typography variant="body2" sx={{ color: '#999' }}>로그인하면 더 많은 기능을 사용할 수 있어요.</Typography>
          <Button variant="contained" onClick={() => navigate('/auth')} sx={{ px: 4, py: 1.25 }}>
            로그인 / 회원가입
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ pb: 10 }}>
      <TopBar title="PROFILE" />

      {/* 프로필 영역 */}
      <Box sx={{ px: 2.5, pt: 3, pb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar sx={{ width: 56, height: 56, bgcolor: '#111', fontSize: '1.375rem', fontWeight: 700 }}>
            {user.email?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem' }}>{user.email}</Typography>
            <Typography variant="caption" sx={{ color: '#999' }}>POP SPOT Member</Typography>
          </Box>
        </Box>

        {/* 통계 */}
        <Box
          sx={{
            display: 'flex', py: 2, border: '1px solid #EAEAEA', borderRadius: 2,
            mb: 3,
          }}
        >
          <StatBox label="SAVED" value={stats.saved} />
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <StatBox label="LIKED" value={stats.liked} />
        </Box>

        {/* 메뉴 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            fullWidth variant="outlined" size="large"
            onClick={() => navigate('/saved')}
            sx={{ justifyContent: 'flex-start', px: 2, py: 1.25, fontWeight: 600, fontSize: '0.875rem' }}
          >
            저장한 팝업/전시 보기
          </Button>
          <Button
            fullWidth variant="outlined" size="large"
            onClick={() => navigate('/write')}
            sx={{ justifyContent: 'flex-start', px: 2, py: 1.25, fontWeight: 600, fontSize: '0.875rem' }}
          >
            팝업/전시 등록하기
          </Button>
          <Button
            fullWidth size="large"
            onClick={handleSignOut}
            sx={{ justifyContent: 'flex-start', px: 2, py: 1.25, color: '#999', fontSize: '0.875rem' }}
          >
            로그아웃
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default ProfilePage
