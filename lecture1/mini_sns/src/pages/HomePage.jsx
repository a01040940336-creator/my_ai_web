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
import { sortByDday, getStatusLabel, getType, getTheme } from '../utils/date'
import { useSavedPosts } from '../hooks/useSavedPosts'
import { useAuth } from '../context/AuthContext'

const THEMES = ['ALL', 'IDOL', 'BEAUTY', 'FASHION', 'ART', 'LIFESTYLE']
const TYPES  = ['ALL', 'POP-UP', 'EXHIBITION']

const FilterRow = ({ items, selected, onChange }) => (
  <Box sx={{ overflowX: 'auto', display: 'flex', gap: 0.875, px: 2, '&::-webkit-scrollbar': { display: 'none' } }}>
    {items.map(item => (
      <Chip
        key={item}
        label={item}
        size="small"
        onClick={() => onChange(item)}
        variant={selected === item ? 'filled' : 'outlined'}
        sx={{
          flexShrink: 0,
          height: 26,
          bgcolor: selected === item ? '#111' : 'transparent',
          color: selected === item ? '#fff' : '#777',
          borderColor: '#E0E0E0',
          fontWeight: 600,
          fontSize: '0.6875rem',
          letterSpacing: '0.02em',
        }}
      />
    ))}
  </Box>
)

const SectionLabel = ({ label, sub, accent }) => (
  <Box sx={{ px: 2, mb: 1.25, display: 'flex', alignItems: 'baseline', gap: 1 }}>
    <Typography sx={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.12em', color: accent ?? '#111' }}>
      {label}
    </Typography>
    {sub && <Typography variant="caption" sx={{ color: '#BBB', fontSize: '0.6875rem' }}>{sub}</Typography>}
  </Box>
)

const HomePage = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState('ALL')
  const [theme, setTheme] = useState('ALL')
  const [showTop, setShowTop] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { savedIds, toggleSave } = useSavedPosts()

  useEffect(() => {
    supabase.from('popspot_posts').select('*')
      .then(({ data }) => { setPosts(sortByDday(data || [])); setLoading(false) })
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
    const typeOk = type === 'ALL' || getType(p.category) === type
    const themeOk = theme === 'ALL' || getTheme(p.category) === theme
    return typeOk && themeOk
  })

  const closingSoon = filtered.filter(p => getStatusLabel(p.start_date, p.end_date) === 'CLOSING SOON')
  const nowOpen    = filtered.filter(p => getStatusLabel(p.start_date, p.end_date) === 'NOW OPEN')
  const upcoming   = filtered.filter(p => getStatusLabel(p.start_date, p.end_date) === 'UPCOMING')

  const Section = ({ label, sub, accent, items }) =>
    items.length === 0 ? null : (
      <Box sx={{ mb: 3.5 }}>
        <SectionLabel label={label} sub={sub} accent={accent} />
        <Box sx={{ px: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          {items.map(post => (
            <PostCard
              key={post.id} post={post}
              isSaved={savedIds.has(post.id)}
              onToggleSave={handleToggleSave}
            />
          ))}
        </Box>
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
          <IconButton onClick={() => navigate('/search')} sx={{ color: '#111' }}>
            <SearchIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* TYPE 필터 */}
      <Box sx={{ pt: 1.5, pb: 0.75 }}>
        <FilterRow items={TYPES} selected={type} onChange={setType} />
      </Box>

      {/* THEME 필터 */}
      <Box sx={{ pb: 1.5 }}>
        <FilterRow items={THEMES} selected={theme} onChange={setTheme} />
      </Box>

      {loading ? (
        <Box sx={{ pt: 8, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">Loading...</Typography>
        </Box>
      ) : (
        <>
          <Section label="CLOSING SOON" sub={`${closingSoon.length}개`} accent="#FF3B30" items={closingSoon} />
          <Section label="NOW OPEN"     sub={`${nowOpen.length}개`}    accent="#111"    items={nowOpen} />
          <Section label="UPCOMING"     sub={`${upcoming.length}개`}   accent="#888"    items={upcoming} />

          {filtered.length === 0 && (
            <Box sx={{ pt: 8, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">해당 조건의 항목이 없어요.</Typography>
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
    </Box>
  )
}

export default HomePage
