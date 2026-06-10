import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Chip from '@mui/material/Chip'
import Fab from '@mui/material/Fab'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import PostCard from '../components/PostCard'
import TopBar from '../components/TopBar'
import { sortByDday, getStatusLabel, getType, getTheme } from '../utils/date'
import { useSavedPosts } from '../hooks/useSavedPosts'

const TYPE_FILTERS   = ['ALL', 'POP-UP', 'EXHIBITION']
const THEME_FILTERS  = ['ALL', 'IDOL', 'BEAUTY', 'FASHION', 'ART', 'LIFESTYLE']
const STATUS_FILTERS = ['ALL', 'CLOSING SOON', 'NOW OPEN', 'UPCOMING', 'ENDED']

const FilterRow = ({ items, selected, onChange, accent }) => (
  <Box sx={{ overflowX: 'auto', display: 'flex', gap: 0.75, px: 2, pb: 0.5, '&::-webkit-scrollbar': { display: 'none' } }}>
    {items.map(item => {
      const active = selected === item
      return (
        <Chip
          key={item}
          label={item}
          size="small"
          onClick={() => onChange(item)}
          variant={active ? 'filled' : 'outlined'}
          sx={{
            flexShrink: 0, height: 26,
            bgcolor: active ? (accent ?? '#111') : 'transparent',
            color: active ? '#fff' : '#777',
            borderColor: '#E0E0E0',
            fontWeight: 600, fontSize: '0.6875rem', letterSpacing: '0.02em',
          }}
        />
      )
    })}
  </Box>
)

const SearchPage = () => {
  const [posts, setPosts] = useState([])
  const [query, setQuery] = useState('')
  const [type, setType] = useState('ALL')
  const [theme, setTheme] = useState('ALL')
  const [status, setStatus] = useState('ALL')
  const [showTop, setShowTop] = useState(false)
  const navigate = useNavigate()
  const { savedIds, toggleSave } = useSavedPosts()

  useEffect(() => {
    supabase.from('popspot_posts').select('*')
      .then(({ data }) => setPosts(sortByDday(data || [])))
  }, [])

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 300)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleToggleSave = async (postId, e) => {
    if (!(await toggleSave(postId, e))) navigate('/auth')
  }

  const filtered = posts.filter(p => {
    const q = query.trim()
    const queryOk = !q || p.title.includes(q) || p.region.includes(q) || p.address?.includes(q) || p.description?.includes(q)
    const typeOk   = type === 'ALL' || getType(p.category) === type
    const themeOk  = theme === 'ALL' || getTheme(p.category) === theme
    const statusOk = status === 'ALL' || getStatusLabel(p.start_date, p.end_date) === status
    return queryOk && typeOk && themeOk && statusOk
  })

  const hasFilter = type !== 'ALL' || theme !== 'ALL' || status !== 'ALL' || query.trim()

  const resetFilters = () => { setType('ALL'); setTheme('ALL'); setStatus('ALL'); setQuery('') }

  return (
    <Box sx={{ pb: 10 }}>
      <TopBar title="SEARCH" />

      {/* 검색바 */}
      <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
        <TextField
          fullWidth size="small"
          placeholder="팝업, 전시, 지역, 키워드 검색"
          value={query}
          onChange={e => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#BBB', fontSize: 18 }} />
              </InputAdornment>
            ),
            sx: { borderRadius: 2, bgcolor: '#F7F7F7', '& fieldset': { border: 'none' }, fontSize: '0.875rem' },
          }}
        />
      </Box>

      {/* TYPE 필터 */}
      <Box sx={{ mb: 0.75 }}>
        <Typography sx={{ px: 2, mb: 0.5, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', color: '#BBB' }}>TYPE</Typography>
        <FilterRow items={TYPE_FILTERS} selected={type} onChange={setType} />
      </Box>

      {/* THEME 필터 */}
      <Box sx={{ mb: 0.75 }}>
        <Typography sx={{ px: 2, mb: 0.5, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', color: '#BBB' }}>THEME</Typography>
        <FilterRow items={THEME_FILTERS} selected={theme} onChange={setTheme} />
      </Box>

      {/* STATUS 필터 */}
      <Box sx={{ mb: 1.25 }}>
        <Typography sx={{ px: 2, mb: 0.5, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', color: '#BBB' }}>STATUS</Typography>
        <FilterRow items={STATUS_FILTERS} selected={status} onChange={setStatus} accent="#FF3B30" />
      </Box>

      {/* 결과 헤더 */}
      <Box sx={{ px: 2, mb: 1.25, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem' }}>
          <Typography component="span" sx={{ fontWeight: 700, color: '#111', fontSize: '0.875rem' }}>{filtered.length}</Typography>
          {' '}results
        </Typography>
        {hasFilter && (
          <Typography
            onClick={resetFilters}
            sx={{ fontSize: '0.6875rem', color: '#999', cursor: 'pointer', textDecoration: 'underline' }}
          >
            필터 초기화
          </Typography>
        )}
      </Box>

      {/* 2열 그리드 */}
      {filtered.length > 0 ? (
        <Box sx={{ px: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          {filtered.map(post => (
            <PostCard
              key={post.id} post={post}
              isSaved={savedIds.has(post.id)}
              onToggleSave={handleToggleSave}
            />
          ))}
        </Box>
      ) : (
        <Box sx={{ pt: 8, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">검색 결과가 없어요.</Typography>
        </Box>
      )}

      {showTop && (
        <Fab size="small" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          sx={{ position: 'fixed', bottom: 76, right: 16, bgcolor: '#111', color: '#fff', '&:hover': { bgcolor: '#333' }, width: 36, height: 36, minHeight: 36 }}>
          <KeyboardArrowUpIcon sx={{ fontSize: 18 }} />
        </Fab>
      )}
    </Box>
  )
}

export default SearchPage
