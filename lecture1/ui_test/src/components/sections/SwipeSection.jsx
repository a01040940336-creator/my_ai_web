import React, { useState } from 'react'
import { Box, IconButton, Typography, Paper } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useSwipeable } from 'react-swipeable'
import SectionBlock from './SectionBlock'

const SLIDES = [
  { id: 1, title: 'React',      subtitle: '컴포넌트 기반 UI',   color: '#61dafb', text: '#000' },
  { id: 2, title: 'TypeScript', subtitle: '정적 타입의 힘',      color: '#3178c6', text: '#fff' },
  { id: 3, title: 'Vite',       subtitle: '초고속 빌드 도구',    color: '#646cff', text: '#fff' },
  { id: 4, title: 'MUI',        subtitle: 'Material Design UI', color: '#1976d2', text: '#fff' },
  { id: 5, title: 'Node.js',    subtitle: '서버사이드 JavaScript', color: '#339933', text: '#fff' },
]

const SwipeSection = () => {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(null)

  const go = (delta) => {
    setDirection(delta > 0 ? 'left' : 'right')
    setIndex((prev) => (prev + delta + SLIDES.length) % SLIDES.length)
  }

  const handlers = useSwipeable({
    onSwipedLeft:  () => go(1),
    onSwipedRight: () => go(-1),
    preventScrollOnSwipe: true,
    trackMouse: true,
  })

  const slide = SLIDES[index]

  return (
    <SectionBlock title="16. Swipe">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', width: '100%', maxWidth: 480 }}>

        {/* 슬라이드 영역 */}
        <Box
          {...handlers}
          sx={{ width: '100%', position: 'relative', cursor: 'grab', '&:active': { cursor: 'grabbing' } }}
        >
          <Paper
            elevation={4}
            sx={{
              height: 200,
              backgroundColor: slide.color,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              borderRadius: 3,
              color: slide.text,
              transition: 'background-color 0.3s ease',
              userSelect: 'none',
            }}
          >
            <Typography variant="h3" fontWeight={800}>{slide.title}</Typography>
            <Typography variant="body1" sx={{ opacity: 0.85 }}>{slide.subtitle}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.6, mt: 1 }}>
              ← 스와이프 또는 드래그 →
            </Typography>
          </Paper>
        </Box>

        {/* 이전/다음 + 인덱스 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <IconButton onClick={() => go(-1)} color="primary">
            <ArrowBackIosNewIcon />
          </IconButton>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {SLIDES.map((_, i) => (
              <Box
                key={i}
                onClick={() => setIndex(i)}
                sx={{
                  width: i === index ? 20 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i === index ? 'primary.main' : 'action.disabled',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                }}
              />
            ))}
          </Box>

          <IconButton onClick={() => go(1)} color="primary">
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary">
          {index + 1} / {SLIDES.length} — <strong>{slide.title}</strong>
        </Typography>
      </Box>
    </SectionBlock>
  )
}

export default SwipeSection
