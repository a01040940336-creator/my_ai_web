import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Fab from '@mui/material/Fab'
import SearchIcon from '@mui/icons-material/Search'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import PostCard from '../components/PostCard'
import { differenceInDays } from '../utils/date'

const CATEGORIES = ['전체', '아이돌', '뷰티', '패션', '전시', '라이프스타일']
const REGIONS = ['전체', '성수', '홍대', '한남', '강남', '이태원', '연남']

const HomePage = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [selectedRegion, setSelectedRegion] = useState('전체')
  const [showTop, setShowTop] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('popspot_posts')
      .select('*')
      .order('created_at', { ascending: false })
    setPosts(data || [])
    setLoading(false)
  }

  const filteredPosts = posts.filter(p => {
    const catOk = selectedCategory === '전체' || p.category === selectedCategory
    const regOk = selectedRegion === '전체' || p.region === selectedRegion
    return catOk && regOk
  })

  const closingSoon = filteredPosts.filter(p => {
    const d = differenceInDays(p.end_date)
    return d >= 0 && d <= 3
  })

  const featured = filteredPosts.filter(p => differenceInDays(p.end_date) > 3)

  return (
    <Box sx={{ pb: 10 }}>
      {/* 헤더 */}
      <AppBar position="sticky">
        <Toolbar sx={{ minHeight: 52, px: 2 }}>
          <Typography
            variant="h2"
            sx={{ flexGrow: 1, fontWeight: 900, letterSpacing: '-0.03em', fontSize: '1.25rem' }}
          >
            POP SPOT
          </Typography>
          <IconButton onClick={() => navigate('/explore')} sx={{ color: '#111' }}>
            <SearchIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* 지역 필터 */}
      <Box sx={{ px: 2, py: 1.5, overflowX: 'auto', display: 'flex', gap: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
        {REGIONS.map(r => (
          <Chip
            key={r}
            label={r}
            size="small"
            onClick={() => setSelectedRegion(r)}
            variant={selectedRegion === r ? 'filled' : 'outlined'}
            sx={{
              flexShrink: 0,
              bgcolor: selectedRegion === r ? '#111' : 'transparent',
              color: selectedRegion === r ? '#fff' : '#666',
              borderColor: '#EAEAEA',
              fontWeight: 500,
            }}
          />
        ))}
      </Box>

      {/* 카테고리 필터 */}
      <Box sx={{ px: 2, pb: 1, overflowX: 'auto', display: 'flex', gap: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
        {CATEGORIES.map(c => (
          <Chip
            key={c}
            label={c}
            size="small"
            onClick={() => setSelectedCategory(c)}
            variant={selectedCategory === c ? 'filled' : 'outlined'}
            sx={{
              flexShrink: 0,
              bgcolor: selectedCategory === c ? '#111' : 'transparent',
              color: selectedCategory === c ? '#fff' : '#666',
              borderColor: '#EAEAEA',
              fontWeight: 500,
            }}
          />
        ))}
      </Box>

      {loading ? (
        <Box sx={{ px: 2, pt: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">불러오는 중...</Typography>
        </Box>
      ) : (
        <>
          {/* CLOSING SOON 섹션 */}
          {closingSoon.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ px: 2, mb: 1.5, display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.1em', color: '#FF3B30' }}>
                  CLOSING SOON
                </Typography>
                <Typography variant="caption" color="text.secondary">마감 임박</Typography>
              </Box>
              <Box sx={{ px: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                {closingSoon.map(post => (
                  <PostCard key={post.id} post={post} compact />
                ))}
              </Box>
            </Box>
          )}

          {/* FEATURED 섹션 */}
          {featured.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Box sx={{ px: 2, mb: 1.5, display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.1em', color: '#111' }}>
                  FEATURED
                </Typography>
                <Typography variant="caption" color="text.secondary">진행중</Typography>
              </Box>
              <Box sx={{ px: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                {featured.map(post => (
                  <PostCard key={post.id} post={post} compact />
                ))}
              </Box>
            </Box>
          )}

          {filteredPosts.length === 0 && (
            <Box sx={{ px: 2, pt: 8, textAlign: 'center' }}>
              <Typography color="text.secondary">해당 조건의 팝업/전시가 없어요.</Typography>
            </Box>
          )}
        </>
      )}

      {/* 스크롤 탑 버튼 */}
      {showTop && (
        <Fab
          size="small"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          sx={{ position: 'fixed', bottom: 80, right: 16, bgcolor: '#111', color: '#fff', '&:hover': { bgcolor: '#333' } }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      )}
    </Box>
  )
}

export default HomePage
