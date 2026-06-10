import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import TopBar from '../components/TopBar'
import { sortByDday, formatDate, getDdayLabel, getStatusLabel, getProgressPercent, getType } from '../utils/date'

const STATUS_TABS = ['ALL', 'CLOSING SOON', 'NOW OPEN', 'UPCOMING', 'ENDED']

const DDAY_COLOR = (label) => {
  if (label === 'CLOSING SOON') return '#FF3B30'
  if (label === 'ENDED') return '#CCC'
  if (label === 'UPCOMING') return '#888'
  return '#111'
}

const CalendarCard = ({ post, navigate }) => {
  const status  = getStatusLabel(post.start_date, post.end_date)
  const dday    = getDdayLabel(post.end_date)
  const progress = getProgressPercent(post.start_date, post.end_date)
  const type    = getType(post.category)
  const isEnded = status === 'ENDED'

  return (
    <Box
      onClick={() => navigate(`/post/${post.id}`)}
      sx={{
        display: 'flex', gap: 1.5, p: 1.5, mb: 1,
        bgcolor: '#FAFAFA', borderRadius: 2, border: '1px solid #F0F0F0',
        cursor: 'pointer', opacity: isEnded ? 0.6 : 1,
        '&:active': { bgcolor: '#F0F0F0' },
      }}
    >
      {/* 썸네일 */}
      <Box sx={{ flexShrink: 0, position: 'relative' }}>
        {post.images?.[0] ? (
          <Box component="img" src={post.images[0]} alt={post.title}
            sx={{ width: 64, height: 64, borderRadius: 1.5, objectFit: 'cover' }} />
        ) : (
          <Box sx={{ width: 64, height: 64, borderRadius: 1.5, bgcolor: '#E8E8E8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ fontSize: '0.5rem', color: '#CCC' }}>NO IMG</Typography>
          </Box>
        )}
        <Box sx={{
          position: 'absolute', bottom: 4, left: 4,
          bgcolor: 'rgba(0,0,0,0.55)', color: '#fff',
          fontSize: '0.5rem', fontWeight: 700, borderRadius: 0.5, px: 0.5, py: 0.125, lineHeight: 1.6,
        }}>
          {type}
        </Box>
      </Box>

      {/* 정보 */}
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        {/* 제목 + D-day */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
          <Typography sx={{
            fontWeight: 700, fontSize: '0.875rem', color: isEnded ? '#AAA' : '#111',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexGrow: 1,
          }}>
            {post.title}
          </Typography>
          <Typography sx={{ fontSize: '0.6875rem', fontWeight: 800, color: DDAY_COLOR(status), flexShrink: 0, letterSpacing: '-0.02em' }}>
            {dday}
          </Typography>
        </Box>

        {/* 지역 + 상태 뱃지 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
          <Typography sx={{ fontSize: '0.6875rem', color: '#999' }}>{post.region}</Typography>
          <Box sx={{
            px: 0.75, py: 0.125, borderRadius: 0.5, lineHeight: 1.6,
            bgcolor: status === 'CLOSING SOON' ? '#FF3B30' : status === 'NOW OPEN' ? '#111' : '#F0F0F0',
            color: status === 'UPCOMING' || status === 'ENDED' ? '#777' : '#fff',
            fontSize: '0.5rem', fontWeight: 700, flexShrink: 0,
          }}>
            {status}
          </Box>
        </Box>

        {/* 기간 */}
        <Typography sx={{ fontSize: '0.6875rem', color: '#CCC', mt: 0.5 }}>
          {formatDate(post.start_date)} → {formatDate(post.end_date)}
        </Typography>

        {/* 진행 바 */}
        <Box sx={{ mt: 0.875 }}>
          <Box sx={{ height: 3, borderRadius: 2, bgcolor: '#EAEAEA', overflow: 'hidden' }}>
            <Box sx={{
              height: '100%', width: `${progress}%`,
              bgcolor: status === 'CLOSING SOON' ? '#FF3B30' : isEnded ? '#CCC' : '#111',
              borderRadius: 2,
            }} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography sx={{ fontSize: '0.5rem', color: '#DDD' }}>START</Typography>
            <Typography sx={{ fontSize: '0.5rem', color: '#DDD' }}>END</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

const CalendarPage = () => {
  const [posts, setPosts] = useState([])
  const [tab, setTab] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.from('popspot_posts').select('*')
      .then(({ data }) => setPosts(sortByDday(data || [])))
  }, [])

  const filtered = tab === 0 ? posts : posts.filter(p => getStatusLabel(p.start_date, p.end_date) === STATUS_TABS[tab])

  const counts = STATUS_TABS.map((s, i) =>
    i === 0 ? posts.length : posts.filter(p => getStatusLabel(p.start_date, p.end_date) === s).length
  )

  return (
    <Box sx={{ pb: 10 }}>
      <TopBar title="CALENDAR" />

      <Tabs
        value={tab} onChange={(_, v) => setTab(v)}
        variant="scrollable" scrollButtons={false}
        sx={{
          borderBottom: '1px solid #EAEAEA', minHeight: 40,
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', color: '#AAA', minHeight: 40, px: 1.25 },
          '& .Mui-selected': { color: '#111 !important' },
          '& .MuiTabs-indicator': { bgcolor: '#111', height: 2 },
        }}
      >
        {STATUS_TABS.map((label, i) => (
          <Tab key={label} label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <span>{label}</span>
              <Box sx={{
                fontSize: '0.5rem', bgcolor: tab === i ? '#111' : '#F0F0F0',
                color: tab === i ? '#fff' : '#AAA', borderRadius: 10,
                px: 0.625, fontWeight: 700, lineHeight: 1.8,
              }}>{counts[i]}</Box>
            </Box>
          } />
        ))}
      </Tabs>

      <Box sx={{ px: 2, pt: 1.5 }}>
        <Typography sx={{ fontSize: '0.6875rem', color: '#CCC', mb: 1.25 }}>
          기간 바(━━)로 진행률 확인 · D-day 순 정렬
        </Typography>

        {filtered.length === 0 ? (
          <Box sx={{ pt: 6, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">해당 항목이 없어요.</Typography>
          </Box>
        ) : (
          filtered.map(post => <CalendarCard key={post.id} post={post} navigate={navigate} />)
        )}
      </Box>
    </Box>
  )
}

export default CalendarPage
