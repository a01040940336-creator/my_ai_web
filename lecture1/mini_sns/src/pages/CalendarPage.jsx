import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import TopBar from '../components/TopBar'
import { differenceInDays, formatDate, getDdayLabel, getStatus, getProgressPercent } from '../utils/date'

const STATUS_TABS = ['전체', '예정', '진행중', '종료']

const STATUS_CHIP_COLOR = {
  예정: { bg: '#F0F0F0', color: '#555' },
  진행중: { bg: '#111', color: '#FFF' },
  종료: { bg: '#EAEAEA', color: '#999' },
}

const DDAY_COLOR = (daysLeft) => {
  if (daysLeft < 0) return '#CCC'
  if (daysLeft <= 3) return '#FF3B30'
  return '#333'
}

const CalendarCard = ({ post, navigate }) => {
  const daysLeft = differenceInDays(post.end_date)
  const status = getStatus(post.start_date, post.end_date)
  const progress = getProgressPercent(post.start_date, post.end_date)
  const ddayLabel = getDdayLabel(post.end_date)
  const isEnded = status === '종료'

  return (
    <Box
      onClick={() => navigate(`/post/${post.id}`)}
      sx={{
        display: 'flex',
        gap: 1.5,
        py: 1.5,
        px: 1.5,
        mb: 1,
        bgcolor: '#FAFAFA',
        borderRadius: 2,
        border: '1px solid #F0F0F0',
        cursor: 'pointer',
        opacity: isEnded ? 0.65 : 1,
        transition: 'background 0.15s',
        '&:active': { bgcolor: '#F0F0F0' },
      }}
    >
      {/* 썸네일 */}
      {post.images?.[0] ? (
        <Box
          component="img"
          src={post.images[0]}
          alt={post.title}
          sx={{ width: 60, height: 60, borderRadius: 1.5, objectFit: 'cover', flexShrink: 0 }}
        />
      ) : (
        <Box
          sx={{
            width: 60, height: 60, borderRadius: 1.5,
            bgcolor: '#EAEAEA', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: '#CCC', fontSize: '0.625rem' }}>없음</Typography>
        </Box>
      )}

      {/* 정보 */}
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        {/* 상단: 제목 + D-day */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: isEnded ? '#AAA' : '#111',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flexGrow: 1,
              fontSize: '0.875rem',
            }}
          >
            {post.title}
          </Typography>
          <Typography
            sx={{
              fontSize: '0.6875rem',
              fontWeight: 800,
              color: DDAY_COLOR(daysLeft),
              flexShrink: 0,
              letterSpacing: '-0.02em',
            }}
          >
            {ddayLabel}
          </Typography>
        </Box>

        {/* 지역 · 카테고리 + 상태 뱃지 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
          <Typography variant="caption" sx={{ color: '#999', fontSize: '0.6875rem' }}>
            {post.region} · {post.category}
          </Typography>
          <Box
            sx={{
              px: 0.75,
              py: 0.125,
              borderRadius: 0.5,
              bgcolor: STATUS_CHIP_COLOR[status].bg,
              color: STATUS_CHIP_COLOR[status].color,
              fontSize: '0.5625rem',
              fontWeight: 700,
              lineHeight: 1.6,
              flexShrink: 0,
            }}
          >
            {status}
          </Box>
        </Box>

        {/* 기간 */}
        <Typography variant="caption" sx={{ color: '#BBB', fontSize: '0.6875rem', display: 'block', mt: 0.5 }}>
          {formatDate(post.start_date)} → {formatDate(post.end_date)}
        </Typography>

        {/* 진행 바 */}
        <Box sx={{ mt: 0.75, position: 'relative' }}>
          <Box
            sx={{
              height: 3,
              borderRadius: 2,
              bgcolor: '#EAEAEA',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                height: '100%',
                width: `${progress}%`,
                bgcolor: isEnded ? '#CCC' : daysLeft <= 3 ? '#FF3B30' : '#111',
                borderRadius: 2,
                transition: 'width 0.4s ease',
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography sx={{ fontSize: '0.5625rem', color: '#CCC' }}>시작</Typography>
            <Typography sx={{ fontSize: '0.5625rem', color: '#CCC' }}>종료</Typography>
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
    supabase
      .from('popspot_posts')
      .select('*')
      .order('end_date', { ascending: true })
      .then(({ data }) => setPosts(data || []))
  }, [])

  const filtered = posts.filter(p => {
    if (tab === 0) return true
    return getStatus(p.start_date, p.end_date) === STATUS_TABS[tab]
  })

  const counts = STATUS_TABS.reduce((acc, s, i) => {
    acc[i] = i === 0 ? posts.length : posts.filter(p => getStatus(p.start_date, p.end_date) === s).length
    return acc
  }, {})

  return (
    <Box sx={{ pb: 10 }}>
      <TopBar title="캘린더" />

      {/* 탭 */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="fullWidth"
        sx={{
          borderBottom: '1px solid #EAEAEA',
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.8125rem',
            color: '#999',
            minHeight: 44,
          },
          '& .Mui-selected': { color: '#111 !important' },
          '& .MuiTabs-indicator': { bgcolor: '#111', height: 2 },
        }}
      >
        {STATUS_TABS.map((label, i) => (
          <Tab
            key={label}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <span>{label}</span>
                <Box
                  sx={{
                    fontSize: '0.625rem',
                    bgcolor: tab === i ? '#111' : '#EAEAEA',
                    color: tab === i ? '#fff' : '#999',
                    borderRadius: 10,
                    px: 0.625,
                    py: 0.125,
                    fontWeight: 700,
                    lineHeight: 1.6,
                  }}
                >
                  {counts[i]}
                </Box>
              </Box>
            }
          />
        ))}
      </Tabs>

      {/* 안내 */}
      <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
        <Typography variant="caption" sx={{ color: '#BBB' }}>
          기간 바(━━━)로 진행률을 확인하세요. 탭하면 상세 페이지로 이동해요.
        </Typography>
      </Box>

      {/* 목록 */}
      <Box sx={{ px: 2, pt: 0.5 }}>
        {filtered.length === 0 ? (
          <Box sx={{ pt: 8, textAlign: 'center' }}>
            <Typography color="text.secondary">해당 항목이 없어요.</Typography>
          </Box>
        ) : (
          filtered.map(post => (
            <CalendarCard key={post.id} post={post} navigate={navigate} />
          ))
        )}
      </Box>
    </Box>
  )
}

export default CalendarPage
