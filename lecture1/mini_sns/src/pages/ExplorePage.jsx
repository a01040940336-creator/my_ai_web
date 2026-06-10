import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Chip from '@mui/material/Chip'
import Fab from '@mui/material/Fab'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import TuneIcon from '@mui/icons-material/Tune'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { supabase } from '../supabase'
import PostCard from '../components/PostCard'
import TopBar from '../components/TopBar'

const CATEGORIES = ['전체', '아이돌', '뷰티', '패션', '전시', '라이프스타일']

const ExplorePage = () => {
  const [posts, setPosts] = useState([])
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [showTop, setShowTop] = useState(false)

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
      .order('end_date', { ascending: true })
    setPosts(data || [])
  }

  const filtered = posts.filter(p => {
    const catOk = selectedCategory === '전체' || p.category === selectedCategory
    const queryOk = !query || p.title.includes(query) || p.region.includes(query) || p.address.includes(query)
    return catOk && queryOk
  })

  return (
    <Box sx={{ pb: 10 }}>
      <TopBar title="탐색" />

      {/* 검색바 */}
      <Box sx={{ px: 2, py: 1.5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="팝업, 전시, 지역 검색"
          value={query}
          onChange={e => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#999', fontSize: 20 }} />
              </InputAdornment>
            ),
            sx: { borderRadius: 2, bgcolor: '#F7F7F7', '& fieldset': { border: 'none' } },
          }}
        />
      </Box>

      {/* 카테고리 */}
      <Box sx={{ px: 2, pb: 1.5, overflowX: 'auto', display: 'flex', gap: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
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

      {/* 결과 수 */}
      <Box sx={{ px: 2, mb: 1.5 }}>
        <Typography variant="caption" color="text.secondary">
          {filtered.length}개 결과
        </Typography>
      </Box>

      {/* 2열 그리드 */}
      <Box sx={{ px: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
        {filtered.map(post => (
          <PostCard key={post.id} post={post} compact />
        ))}
      </Box>

      {filtered.length === 0 && (
        <Box sx={{ pt: 8, textAlign: 'center' }}>
          <Typography color="text.secondary">검색 결과가 없어요.</Typography>
        </Box>
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

export default ExplorePage
