import { useEffect, useState, useRef, useCallback } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import SearchIcon from '@mui/icons-material/Search'
import ListIcon from '@mui/icons-material/FormatListBulleted'
import MapIcon from '@mui/icons-material/Map'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../supabase'
import PostCard from '../components/PostCard'
import MapView from '../components/MapView'
import TopBar from '../components/TopBar'
import { SkeletonGrid } from '../components/SkeletonCard'
import { sortByDday, getStatusLabel } from '../utils/date'
import { useSavedPosts } from '../hooks/useSavedPosts'

const REGIONS = ['서울', '성수', '홍대', '강남', '한남', '부산', '제주']
const CATEGORIES = ['전시', '팝업스토어', '아이돌', '뷰티', '패션', '라이프스타일']
const SEOUL_DISTRICTS = ['성수', '홍대', '강남', '한남', '이태원', '연남']

const matchRegion = (post, r) => {
  if (!r) return true
  if (r === '서울') return SEOUL_DISTRICTS.includes(post.region)
  return post.region === r
}
const matchCategory = (post, c) => {
  if (!c) return true
  if (c === '팝업스토어') return post.category !== '전시'
  return post.category === c
}

const PAGE_SIZE = 12

const SearchPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('')
  const [category, setCategory] = useState('')
  const [viewMode, setViewMode] = useState(
    location.pathname.includes('/map') ? 'map' : 'list'
  )
  const [page, setPage] = useState(PAGE_SIZE)
  const loaderRef = useRef(null)
  const { savedIds, toggleSave } = useSavedPosts()

  useEffect(() => {
    supabase.from('popspot_posts').select('*')
      .then(({ data }) => { setPosts(sortByDday(data ?? [])); setLoading(false) })
  }, [])

  // 무한 스크롤
  useEffect(() => {
    if (viewMode !== 'list') return
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) setPage(p => p + PAGE_SIZE)
    }, { rootMargin: '200px' })
    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [viewMode, loaderRef.current])

  // 필터 변경 시 page 리셋
  useEffect(() => { setPage(PAGE_SIZE) }, [query, region, category])

  const handleToggleSave = async (postId, e) => {
    if (!(await toggleSave(postId, e))) navigate('/auth')
  }

  const handleViewMode = (_, v) => {
    if (!v) return
    setViewMode(v)
    navigate(v === 'map' ? '/search/map' : '/search', { replace: true })
  }

  const filtered = posts.filter(p => {
    const q = query.trim()
    const qOk = !q || p.title?.includes(q) || p.region?.includes(q) || p.address?.includes(q) || p.description?.includes(q)
    return qOk && matchRegion(p, region) && matchCategory(p, category)
  })

  const visible = filtered.slice(0, page)

  return (
    <Box sx={{ pb: 10, display: 'flex', flexDirection: 'column', height: viewMode === 'map' ? '100dvh' : 'auto' }}>
      <TopBar title="SEARCH" />

      {/* 검색바 */}
      <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
        <TextField
          fullWidth size="small"
          placeholder="팝업, 전시, 지역, 키워드"
          value={query}
          onChange={e => setQuery(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#CCC', fontSize: 18 }} /></InputAdornment>,
            sx: { borderRadius: 2, bgcolor: '#F7F7F7', '& fieldset': { border: 'none' }, fontSize: '0.875rem' },
          }}
        />
      </Box>

      {/* 필터 + 뷰 토글 */}
      <Box sx={{ px: 2, pb: 1.25, display: 'flex', gap: 1, alignItems: 'center' }}>
        <FormControl size="small" sx={{ flex: 1 }}>
          <Select value={region} onChange={e => setRegion(e.target.value)} displayEmpty
            sx={{ bgcolor: '#F7F7F7', '& fieldset': { border: 'none' }, borderRadius: 1.5, fontSize: '0.8125rem' }}>
            <MenuItem value=""><Typography sx={{ color: '#999', fontSize: '0.8125rem' }}>지역</Typography></MenuItem>
            {REGIONS.map(r => <MenuItem key={r} value={r} sx={{ fontSize: '0.8125rem' }}>{r}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ flex: 1 }}>
          <Select value={category} onChange={e => setCategory(e.target.value)} displayEmpty
            sx={{ bgcolor: '#F7F7F7', '& fieldset': { border: 'none' }, borderRadius: 1.5, fontSize: '0.8125rem' }}>
            <MenuItem value=""><Typography sx={{ color: '#999', fontSize: '0.8125rem' }}>분야</Typography></MenuItem>
            {CATEGORIES.map(c => <MenuItem key={c} value={c} sx={{ fontSize: '0.8125rem' }}>{c}</MenuItem>)}
          </Select>
        </FormControl>

        {/* LIST / MAP 토글 */}
        <ToggleButtonGroup value={viewMode} exclusive onChange={handleViewMode} size="small"
          sx={{ flexShrink: 0, bgcolor: '#F7F7F7', borderRadius: 1.5 }}>
          <ToggleButton value="list" sx={{ border: 'none', borderRadius: '10px !important', px: 1.25, py: 0.625, '&.Mui-selected': { bgcolor: '#111', color: '#fff' } }}>
            <ListIcon sx={{ fontSize: 18 }} />
          </ToggleButton>
          <ToggleButton value="map" sx={{ border: 'none', borderRadius: '10px !important', px: 1.25, py: 0.625, '&.Mui-selected': { bgcolor: '#111', color: '#fff' } }}>
            <MapIcon sx={{ fontSize: 18 }} />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* 결과 수 (리스트 모드만) */}
      {viewMode === 'list' && (
        <Box sx={{ px: 2, mb: 1.25 }}>
          <Typography sx={{ fontSize: '0.75rem', color: '#AAA' }}>
            <Typography component="span" sx={{ fontWeight: 700, color: '#111', fontSize: '0.875rem' }}>{filtered.length}</Typography>
            {' '}results · D-day 순
          </Typography>
        </Box>
      )}

      {/* ── LIST VIEW ── */}
      {viewMode === 'list' && (
        loading ? (
          <SkeletonGrid count={6} />
        ) : filtered.length === 0 ? (
          <Box sx={{ pt: 8, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">검색 결과가 없어요.</Typography>
          </Box>
        ) : (
          <>
            <Box sx={{
              px: { xs: 2, md: 3 },
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
              gap: { xs: 2, md: 2.5 },
            }}>
              {visible.map(post => (
                <PostCard key={post.id} post={post}
                  isSaved={savedIds.has(post.id)}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </Box>
            {/* 무한 스크롤 트리거 */}
            {page < filtered.length && (
              <Box ref={loaderRef} sx={{ py: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">불러오는 중...</Typography>
              </Box>
            )}
          </>
        )
      )}

      {/* ── MAP VIEW ── */}
      {viewMode === 'map' && (
        <Box sx={{ flexGrow: 1, overflow: 'hidden', mx: 0 }}>
          <MapView
            posts={filtered}
            onPostClick={post => navigate(`/post/${post.id}`)}
          />
        </Box>
      )}
    </Box>
  )
}

export default SearchPage
