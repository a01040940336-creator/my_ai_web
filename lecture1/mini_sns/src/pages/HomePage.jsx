import { useEffect, useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Fab from '@mui/material/Fab'
import SearchIcon from '@mui/icons-material/Search'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import PostCard from '../components/PostCard'
import InlineSearch from '../components/InlineSearch'
import { SkeletonGrid } from '../components/SkeletonCard'
import { sortByDday, getStatusLabel, haversineDistance } from '../utils/date'
import { useSavedPosts } from '../hooks/useSavedPosts'
import { useSearch } from '../context/SearchContext'

const REGIONS = ['서울', '성수', '홍대', '강남', '한남', '부산', '제주']
const CATEGORIES = ['전시', '팝업스토어', '아이돌', '뷰티', '패션', '라이프스타일']
const SEOUL_DISTRICTS = ['성수', '홍대', '강남', '한남', '이태원', '연남']

const matchRegion = (post, region) => {
  if (!region) return true
  if (region === '서울') return SEOUL_DISTRICTS.includes(post.region)
  return post.region === region
}

const matchCategory = (post, category) => {
  if (!category) return true
  if (category === '팝업스토어') return post.category !== '전시'
  return post.category === category
}

const SectionLabel = ({ label, sub, accent }) => (
  <Box sx={{ px: { xs: 2, md: 3 }, mb: 1.25, display: 'flex', alignItems: 'baseline', gap: 1 }}>
    <Typography sx={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.12em', color: accent ?? '#111' }}>
      {label}
    </Typography>
    {sub && <Typography sx={{ fontSize: '0.6875rem', color: '#CCC' }}>{sub}</Typography>}
  </Box>
)

const PostGrid = ({ posts, savedIds, onToggleSave }) => (
  <Box sx={{
    px: { xs: 2, md: 3 },
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
    gap: { xs: 2, md: 2.5 },
  }}>
    {posts.map(post => (
      <PostCard
        key={post.id} post={post}
        isSaved={savedIds.has(post.id)}
        onToggleSave={onToggleSave}
      />
    ))}
  </Box>
)

const HomePage = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [region, setRegion] = useState('')
  const [category, setCategory] = useState('')
  const [userLocation, setUserLocation] = useState(null)
  const [showTop, setShowTop] = useState(false)
  const navigate = useNavigate()
  const { savedIds, toggleSave } = useSavedPosts()
  const { searchOpen, openSearch, closeSearch } = useSearch()

  useEffect(() => {
    supabase.from('popspot_posts').select('*')
      .then(({ data }) => { setPosts(sortByDday(data ?? [])); setLoading(false) })
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLocation(null),
      { timeout: 4000 }
    )
  }, [])

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 300)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleToggleSave = async (postId, e) => {
    if (!(await toggleSave(postId, e))) navigate('/auth')
  }

  const filtered = useMemo(() =>
    posts.filter(p => matchRegion(p, region) && matchCategory(p, category)),
    [posts, region, category]
  )

  // CLOSING SOON: D-3 이내
  const closingSoon = filtered.filter(p => getStatusLabel(p.start_date, p.end_date) === 'CLOSING SOON')

  // NEAR YOU: 위치 기반, 없으면 인기 or 최근
  const nearYou = useMemo(() => {
    const active = filtered.filter(p => {
      const s = getStatusLabel(p.start_date, p.end_date)
      return s === 'NOW OPEN' || s === 'CLOSING SOON'
    })
    if (userLocation) {
      return [...active]
        .filter(p => p.latitude && p.longitude)
        .sort((a, b) =>
          haversineDistance(userLocation.lat, userLocation.lng, a.latitude, a.longitude) -
          haversineDistance(userLocation.lat, userLocation.lng, b.latitude, b.longitude)
        )
        .slice(0, 4)
    }
    // 위치 권한 없으면 랜덤 4개
    return [...active].sort(() => 0.5 - Math.random()).slice(0, 4)
  }, [filtered, userLocation])

  // TODAY PICK: 오늘 종료 (D-DAY) 우선, 없으면 D-1
  const todayPick = useMemo(() => {
    const ending = filtered.filter(p => {
      const s = getStatusLabel(p.start_date, p.end_date)
      return s === 'CLOSING SOON' || s === 'NOW OPEN'
    })
    const sorted = [...ending].sort((a, b) => new Date(a.end_date) - new Date(b.end_date))
    return sorted.slice(0, 4)
  }, [filtered])

  // FEATURED: 나머지 진행중 + 예정
  const featured = filtered.filter(p => {
    const s = getStatusLabel(p.start_date, p.end_date)
    return s === 'NOW OPEN' || s === 'UPCOMING'
  })

  const Section = ({ label, sub, accent, items }) =>
    !items?.length ? null : (
      <Box sx={{ mb: 3.5 }}>
        <SectionLabel label={label} sub={sub} accent={accent} />
        <PostGrid posts={items} savedIds={savedIds} onToggleSave={handleToggleSave} />
      </Box>
    )

  return (
    <Box sx={{ pb: 10 }}>
      {/* 헤더 */}
      <AppBar position="sticky">
        <Toolbar sx={{ minHeight: 52, px: 2 }}>
          <Typography sx={{ flexGrow: 1, fontWeight: 900, letterSpacing: '-0.04em', fontSize: '1.25rem', color: '#111' }}>
            POP SPOT
          </Typography>
          <IconButton onClick={openSearch} sx={{ color: '#111' }}>
            <SearchIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* 필터 바 (지역 + 분야 드롭다운) */}
      <Box sx={{ px: { xs: 2, md: 3 }, pt: 1.5, pb: 1, display: 'flex', gap: 1.5 }}>
        <FormControl size="small" sx={{ flex: 1 }}>
          <Select
            value={region}
            onChange={e => setRegion(e.target.value)}
            displayEmpty
            sx={{ bgcolor: '#F7F7F7', '& fieldset': { border: 'none' }, borderRadius: 1.5, fontSize: '0.875rem' }}
          >
            <MenuItem value=""><Typography sx={{ color: '#999', fontSize: '0.875rem' }}>지역 전체</Typography></MenuItem>
            {REGIONS.map(r => <MenuItem key={r} value={r} sx={{ fontSize: '0.875rem' }}>{r}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ flex: 1 }}>
          <Select
            value={category}
            onChange={e => setCategory(e.target.value)}
            displayEmpty
            sx={{ bgcolor: '#F7F7F7', '& fieldset': { border: 'none' }, borderRadius: 1.5, fontSize: '0.875rem' }}
          >
            <MenuItem value=""><Typography sx={{ color: '#999', fontSize: '0.875rem' }}>분야 전체</Typography></MenuItem>
            {CATEGORIES.map(c => <MenuItem key={c} value={c} sx={{ fontSize: '0.875rem' }}>{c}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ mt: 2 }}><SkeletonGrid count={6} /></Box>
      ) : (
        <>
          <Section label="CLOSING SOON" sub={`${closingSoon.length}개 · 마감 임박`} accent="#FF3B30" items={closingSoon} />
          <Section label="NEAR YOU" sub={userLocation ? '내 주변' : '추천 픽'} items={nearYou} />
          <Section label="TODAY PICK" sub="지금 가기 좋은" items={todayPick} />
          <Section label="FEATURED" sub={`${featured.length}개 · 진행중/예정`} items={featured} />

          {filtered.length === 0 && (
            <Box sx={{ pt: 8, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">해당 조건의 팝업/전시가 없어요.</Typography>
            </Box>
          )}
        </>
      )}

      {showTop && (
        <Fab size="small" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          sx={{ position: 'fixed', bottom: 76, right: 16, bgcolor: '#111', color: '#fff', '&:hover': { bgcolor: '#333' }, width: 36, height: 36, minHeight: 36 }}>
          <KeyboardArrowUpIcon sx={{ fontSize: 18 }} />
        </Fab>
      )}

      <InlineSearch
        open={searchOpen}
        onClose={closeSearch}
        posts={posts}
        savedIds={savedIds}
        onToggleSave={handleToggleSave}
      />
    </Box>
  )
}

export default HomePage
