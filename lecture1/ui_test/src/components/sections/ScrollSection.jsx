import React, { useRef, useState } from 'react'
import { Box, Paper, Typography, Fab, Divider, Chip } from '@mui/material'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import SectionBlock from './SectionBlock'

const POSTS = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  title: `포스트 #${String(i + 1).padStart(2, '0')}`,
  content: [
    'React는 컴포넌트 기반 UI 라이브러리로, 재사용 가능한 UI를 효율적으로 구성할 수 있어요.',
    'MUI는 Material Design 기반의 React 컴포넌트 라이브러리입니다. 빠른 UI 개발이 가능해요.',
    'Vite는 ESM 기반의 초고속 빌드 도구로, HMR 속도가 매우 빠릅니다.',
    'TypeScript는 JavaScript의 슈퍼셋으로 정적 타입을 제공해 코드 안정성을 높여줘요.',
    'HTML5 Drag and Drop API를 활용하면 외부 라이브러리 없이 드래그 기능을 구현할 수 있어요.',
  ][i % 5],
  tag: ['React', 'MUI', 'Vite', 'TypeScript', 'HTML5'][i % 5],
}))

const SCROLL_TOP_THRESHOLD = 80

const ScrollSection = () => {
  const containerRef = useRef(null)
  const [scrollTop, setScrollTop] = useState(0)

  const handleScroll = () => {
    setScrollTop(containerRef.current?.scrollTop ?? 0)
  }

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const progress = Math.min(
    100,
    Math.round((scrollTop / ((containerRef.current?.scrollHeight ?? 300) - 300)) * 100) || 0
  )

  return (
    <SectionBlock title="11. Scroll">
      <Box sx={{ width: '100%', position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            스크롤 위치: <strong>{scrollTop}px</strong>
          </Typography>
          <Chip label={`${progress}%`} size="small" color={progress > 0 ? 'primary' : 'default'} />
        </Box>

        <Paper
          ref={containerRef}
          variant="outlined"
          onScroll={handleScroll}
          sx={{
            height: 300,
            overflowY: 'auto',
            p: 2,
            position: 'relative',
          }}
        >
          {POSTS.map(({ id, title, content, tag }, idx) => (
            <Box key={id}>
              <Box sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="subtitle2" fontWeight={700}>{title}</Typography>
                  <Chip label={tag} size="small" variant="outlined" sx={{ fontSize: '0.65rem' }} />
                </Box>
                <Typography variant="body2" color="text.secondary">{content}</Typography>
              </Box>
              {idx < POSTS.length - 1 && <Divider />}
            </Box>
          ))}
        </Paper>

        {scrollTop >= SCROLL_TOP_THRESHOLD && (
          <Fab
            size="small"
            color="primary"
            onClick={scrollToTop}
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
            }}
          >
            <KeyboardArrowUpIcon />
          </Fab>
        )}
      </Box>
    </SectionBlock>
  )
}

export default ScrollSection
