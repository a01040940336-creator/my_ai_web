import React, { useState } from 'react'
import { Box, Button, Fade, Grow, Slide, Paper, Typography, Chip } from '@mui/material'
import SectionBlock from './SectionBlock'

const ANIMATIONS = [
  { key: 'fade',  label: 'Fade',  color: 'primary'   },
  { key: 'grow',  label: 'Grow',  color: 'secondary' },
  { key: 'slide', label: 'Slide', color: 'success'   },
  { key: 'css',   label: 'Bounce (CSS)', color: 'warning' },
]

const contentStyle = {
  p: 2,
  width: 140,
  textAlign: 'center',
  borderRadius: 2,
}

const AnimationSection = () => {
  const [visible, setVisible] = useState({})

  const toggle = (key) => setVisible((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <SectionBlock title="12. Animation">
      {ANIMATIONS.map(({ key, label, color }) => (
        <Box key={key} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'flex-start', minWidth: 160 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>
            {label}
          </Typography>

          <Button variant="outlined" color={color} size="small" onClick={() => toggle(key)}>
            {visible[key] ? '숨기기' : '보이기'}
          </Button>

          <Box sx={{ minHeight: 80, display: 'flex', alignItems: 'center' }}>
            {key === 'fade' && (
              <Fade in={!!visible[key]} timeout={600}>
                <Paper sx={{ ...contentStyle, backgroundColor: '#e3f2fd' }}>
                  <Typography variant="body2" fontWeight={600}>Fade</Typography>
                  <Typography variant="caption" color="text.secondary">투명도 전환</Typography>
                </Paper>
              </Fade>
            )}

            {key === 'grow' && (
              <Grow in={!!visible[key]} timeout={500}>
                <Paper sx={{ ...contentStyle, backgroundColor: '#fce4ec' }}>
                  <Typography variant="body2" fontWeight={600}>Grow</Typography>
                  <Typography variant="caption" color="text.secondary">크기 확장</Typography>
                </Paper>
              </Grow>
            )}

            {key === 'slide' && (
              <Slide in={!!visible[key]} direction="right" timeout={400}>
                <Paper sx={{ ...contentStyle, backgroundColor: '#e8f5e9' }}>
                  <Typography variant="body2" fontWeight={600}>Slide</Typography>
                  <Typography variant="caption" color="text.secondary">방향 슬라이드</Typography>
                </Paper>
              </Slide>
            )}

            {key === 'css' && visible[key] && (
              <Paper
                sx={{
                  ...contentStyle,
                  backgroundColor: '#fff8e1',
                  animation: 'bounce 0.6s ease',
                  '@keyframes bounce': {
                    '0%':   { transform: 'scale(0.3)', opacity: 0 },
                    '50%':  { transform: 'scale(1.1)' },
                    '70%':  { transform: 'scale(0.95)' },
                    '100%': { transform: 'scale(1)',   opacity: 1 },
                  },
                }}
              >
                <Typography variant="body2" fontWeight={600}>Bounce</Typography>
                <Typography variant="caption" color="text.secondary">CSS 키프레임</Typography>
              </Paper>
            )}
          </Box>
        </Box>
      ))}
    </SectionBlock>
  )
}

export default AnimationSection
