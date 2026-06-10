import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import TopBar from '../components/TopBar'
import { differenceInDays, formatDate } from '../utils/date'

const CalendarPage = () => {
  const [posts, setPosts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    supabase
      .from('popspot_posts')
      .select('*')
      .gte('end_date', new Date().toISOString().slice(0, 10))
      .order('end_date', { ascending: true })
      .then(({ data }) => setPosts(data || []))
  }, [])

  const grouped = posts.reduce((acc, post) => {
    const key = post.end_date
    if (!acc[key]) acc[key] = []
    acc[key].push(post)
    return acc
  }, {})

  return (
    <Box sx={{ pb: 10 }}>
      <TopBar title="캘린더" />
      <Box sx={{ px: 2.5, pt: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          종료일 기준으로 정렬된 팝업/전시 목록이에요.
        </Typography>

        {Object.entries(grouped).map(([date, items]) => {
          const daysLeft = differenceInDays(date)
          const isToday = daysLeft === 0
          const isClosing = daysLeft <= 3

          return (
            <Box key={date} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: isToday ? '#FF3B30' : '#111' }}>
                  {formatDate(date)}
                </Typography>
                {isClosing && (
                  <Chip
                    label={isToday ? 'TODAY' : `D-${daysLeft}`}
                    size="small"
                    sx={{ bgcolor: '#FF3B30', color: '#fff', fontWeight: 700, fontSize: '0.625rem', height: 18 }}
                  />
                )}
              </Box>

              {items.map(post => (
                <Box
                  key={post.id}
                  onClick={() => navigate(`/post/${post.id}`)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 1.25,
                    borderBottom: '1px solid #F0F0F0',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#F7F7F7' },
                    mx: -1, px: 1, borderRadius: 1,
                  }}
                >
                  {post.images?.[0] && (
                    <Box
                      component="img"
                      src={post.images[0]}
                      alt={post.title}
                      sx={{ width: 44, height: 44, borderRadius: 1, objectFit: 'cover', flexShrink: 0 }}
                    />
                  )}
                  <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {post.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {post.region} · {post.category}
                    </Typography>
                  </Box>
                  <Chip
                    label={post.category}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.625rem', height: 20, borderColor: '#EAEAEA', color: '#999', flexShrink: 0 }}
                  />
                </Box>
              ))}
            </Box>
          )
        })}

        {Object.keys(grouped).length === 0 && (
          <Box sx={{ pt: 8, textAlign: 'center' }}>
            <Typography color="text.secondary">현재 진행 중인 팝업/전시가 없어요.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default CalendarPage
