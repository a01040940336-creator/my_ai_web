import { useState } from 'react'
import { Box, IconButton, Paper, Typography } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

function getCalendarGrid(year, month) {
  const firstDow = new Date(year, month, 1).getDay()
  const lastDay  = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= lastDay; d++) cells.push(d)
  return cells
}

function pad(n) { return String(n).padStart(2, '0') }

export default function CalendarView({ posts, selectedDate, onDayClick }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const cells = getCalendarGrid(year, month)

  const postsByDate = {}
  posts.forEach(p => {
    if (!postsByDate[p.date]) postsByDate[p.date] = []
    postsByDate[p.date].push(p)
  })

  const todayStr = `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  return (
    <Paper
      sx={{
        borderRadius: 4,
        p: 2.5,
        mb: 3,
        background: 'linear-gradient(135deg, #fff8fb 0%, #f8f0ff 100%)',
        boxShadow: '0 4px 20px rgba(244,143,177,0.15)',
      }}
    >
      {/* 월 네비게이션 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <IconButton size="small" onClick={prevMonth} sx={{ color: 'primary.main' }}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={800} color="primary.dark">
          {year}년 {month + 1}월 🗓️
        </Typography>
        <IconButton size="small" onClick={nextMonth} sx={{ color: 'primary.main' }}>
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {/* 요일 헤더 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 0.5 }}>
        {DAYS.map((d, i) => (
          <Typography
            key={d}
            variant="caption"
            textAlign="center"
            fontWeight={700}
            color={i === 0 ? 'error.light' : i === 6 ? 'primary.main' : 'text.secondary'}
          >
            {d}
          </Typography>
        ))}
      </Box>

      {/* 날짜 셀 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
        {cells.map((day, idx) => {
          if (!day) return <Box key={`empty-${idx}`} sx={{ minHeight: 56 }} />

          const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`
          const dayPosts = postsByDate[dateStr] || []
          const isToday    = dateStr === todayStr
          const isSelected = dateStr === selectedDate
          const isSun = idx % 7 === 0
          const isSat = idx % 7 === 6
          const hasPost = dayPosts.length > 0

          return (
            <Box
              key={day}
              onClick={() => hasPost && onDayClick(dateStr)}
              sx={{
                minHeight: 56,
                borderRadius: 2.5,
                p: 0.5,
                cursor: hasPost ? 'pointer' : 'default',
                border: '2px solid',
                borderColor: isSelected
                  ? 'primary.main'
                  : isToday
                  ? 'primary.light'
                  : 'transparent',
                bgcolor: isSelected
                  ? '#fce4ec'
                  : isToday
                  ? '#fff0f6'
                  : hasPost
                  ? '#fdf6ff'
                  : 'transparent',
                transition: 'all 0.15s',
                '&:hover': hasPost
                  ? { bgcolor: '#fce4ec', transform: 'scale(1.08)', boxShadow: '0 2px 10px rgba(244,143,177,0.25)' }
                  : {},
              }}
            >
              {/* 날짜 숫자 */}
              <Typography
                variant="caption"
                fontWeight={isToday ? 800 : 500}
                display="block"
                textAlign="center"
                lineHeight={1.6}
                color={
                  isSun ? 'error.main'
                  : isSat ? 'primary.main'
                  : isToday ? 'primary.dark'
                  : 'text.primary'
                }
              >
                {day}
              </Typography>

              {/* 대표 이모지 */}
              {hasPost && (
                <Box sx={{ textAlign: 'center', lineHeight: 1 }}>
                  <Typography sx={{ fontSize: 20 }}>
                    {dayPosts[0].emoji}
                  </Typography>
                  {dayPosts.length > 1 && (
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: 9, fontWeight: 700,
                        color: 'primary.dark',
                        bgcolor: '#fce4ec',
                        borderRadius: 1,
                        px: 0.5,
                      }}
                    >
                      +{dayPosts.length - 1}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          )
        })}
      </Box>

      {/* 범례 */}
      <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: 1, bgcolor: '#fce4ec', border: '2px solid', borderColor: 'primary.main' }} />
          <Typography variant="caption" color="text.secondary">선택된 날</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: 1, bgcolor: '#fff0f6', border: '2px solid', borderColor: 'primary.light' }} />
          <Typography variant="caption" color="text.secondary">오늘</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: 1, bgcolor: '#fdf6ff' }} />
          <Typography variant="caption" color="text.secondary">일상 있음</Typography>
        </Box>
      </Box>
    </Paper>
  )
}
