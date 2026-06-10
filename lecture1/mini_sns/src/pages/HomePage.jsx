import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Fab from '@mui/material/Fab'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import PostCard from '../components/PostCard'
import { differenceInDays } from '../utils/date'
import { useSavedPosts } from '../hooks/useSavedPosts'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = ['전체', '아이돌', '뷰티', '패션', '전시', '라이프스타일']
const REGIONS = ['전체', '성수', '홍대', '한남', '강남', '이태원', '연남']

const FilterChip = ({ label, selected, onClick }) => (
  <Chip
    label={label}
    size="small"
    onClick={onClick}
    variant={selected ? 'filled' : 'outlined'}
    sx={{
      flexShrink: 0,
      bgcolor: selected ? '#111' : 'transparent',
      color: selected ? '#fff' : '#666',
      borderColor: '#EAEAEA',
      fontWeight: 500,
    }}
  />
)

const SectionHeader = ({ label, sub, color = '#111' }) => (
  <Box sx={{ px: 2, mb: 1.5, display: 'flex', alignItems: 'baseline', gap: 1 }}>
    <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.1em', color }}>
      {label}
    </Typography>
    {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
  </Box>
)

const HomePage = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [selectedRegion, setSelectedRegion] = useState('전체')
  const [showTop, setShowTop] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { savedIds, toggleSave } = useSavedPosts()

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
      .order('end_date', { ascending: true }) // D-day 기준 정렬
    setPosts(data || [])
    setLoading(false)
  }

  const handleToggleSave = async (postId, e) => {
    const ok = await toggleSave(postId, e)
    if (!ok) navigate('/auth')
  }

  // 필터 적용 + 진행 중인 항목만
  const activePosts = posts.filter(p => {
    const d = differenceInDays(p.end_date)
    const catOk = selectedCategory === '전체' || p.category === selectedCategory
    const regOk = selectedRegion === '전체' || p.region === selectedRegion
    return d >= 0 && catOk && regOk
  })

  const closingSoon = activePosts.filter(p => differenceInDays(p.end_date) <= 3)
  const featured = activePosts.filter(p => differenceInDays(p.end_date) > 3)

  // 저장된 게시물 (필터 무관)
  const savedPosts = posts.filter(p => savedIds.has(p.id) && differenceInDays(p.end_date) >= 0)

  return (
    <Box sx={{ pb: 10 }}>
      {/* 헤더 */}
      <AppBar position="sticky">
        <Toolbar sx={{ minHeight: 52, px: 2 }}>
          <Typography
            variant="h2"
            sx={{ flexGrow: 1, fontWeight: 900, letterSpacing: '-0.04em', fontSize: '1.25rem' }}
          >
            POP SPOT
          </Typography>
          <IconButton onClick={() => navigate('/explore')} sx={{ color: '#111' }}>
            <SearchIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* 지역 필터 */}
      <Box sx={{ px: 2, pt: 1.5, pb: 0.75, overflowX: 'auto', display: 'flex', gap: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
        {REGIONS.map(r => (
          <FilterChip key={r} label={r} selected={selectedRegion === r} onClick={() => setSelectedRegion(r)} />
        ))}
      </Box>

      {/* 카테고리 필터 */}
      <Box sx={{ px: 2, pb: 1.25, overflowX: 'auto', display: 'flex', gap: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
        {CATEGORIES.map(c => (
          <FilterChip key={c} label={c} selected={selectedCategory === c} onClick={() => setSelectedCategory(c)} />
        ))}
      </Box>

      {loading ? (
        <Box sx={{ px: 2, pt: 6, textAlign: 'center' }}>
          <Typography color="text.secondary">불러오는 중...</Typography>
        </Box>
      ) : (
        <>
          {/* ── MY SAVES 섹션 ── */}
          {user && (
            <Box sx={{ mt: 1.5, mb: 2 }}>
              <Box sx={{ px: 2, mb: 1.25, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.1em', color: '#111' }}>
                    MY SAVES
                  </Typography>
                  <Typography variant="caption" color="text.secondary">저장한 항목</Typography>
                </Box>
                <Button
                  size="small"
                  sx={{ fontSize: '0.6875rem', color: '#888', minWidth: 0, p: 0 }}
                  onClick={() => navigate('/mypage')}
                >
                  전체보기
                </Button>
              </Box>

              {savedPosts.length === 0 ? (
                <Box
                  sx={{
                    mx: 2, py: 2.5,
                    border: '1.5px dashed #EAEAEA',
                    borderRadius: 2,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
                  }}
                >
                  <BookmarkBorderIcon sx={{ color: '#CCC', fontSize: 22 }} />
                  <Typography variant="caption" color="text.secondary">아직 저장한 팝업/전시가 없어요</Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    pl: 2, pr: 1,
                    display: 'flex',
                    gap: 1.25,
                    overflowX: 'auto',
                    '&::-webkit-scrollbar': { display: 'none' },
                  }}
                >
                  {savedPosts.slice(0, 8).map(post => (
                    <Box key={post.id} sx={{ width: 120, flexShrink: 0 }}>
                      <PostCard
                        post={post}
                        compact
                        isSaved={savedIds.has(post.id)}
                        onToggleSave={handleToggleSave}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {/* ── CLOSING SOON 섹션 ── */}
          {closingSoon.length > 0 && (
            <Box sx={{ mt: user ? 0 : 1.5, mb: 3 }}>
              <SectionHeader label="CLOSING SOON" sub="마감 임박" color="#FF3B30" />
              <Box sx={{ px: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                {closingSoon.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    compact
                    isSaved={savedIds.has(post.id)}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* ── FEATURED 섹션 ── */}
          {featured.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <SectionHeader label="FEATURED" sub="진행중" />
              <Box sx={{ px: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                {featured.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    compact
                    isSaved={savedIds.has(post.id)}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </Box>
            </Box>
          )}

          {activePosts.length === 0 && (
            <Box sx={{ px: 2, pt: 6, textAlign: 'center' }}>
              <Typography color="text.secondary">해당 조건의 팝업/전시가 없어요.</Typography>
            </Box>
          )}
        </>
      )}

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
