import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import SectionBlock from './SectionBlock'

const EFFECTS = [
  {
    label: '색상 변화',
    desc: 'background-color transition',
    base: { backgroundColor: '#e3f2fd', color: '#1565c0' },
    hover: { backgroundColor: '#1976d2', color: '#fff' },
  },
  {
    label: '크기 확대',
    desc: 'transform: scale()',
    base: { transform: 'scale(1)' },
    hover: { transform: 'scale(1.08)' },
  },
  {
    label: '그림자 강화',
    desc: 'box-shadow elevation',
    base: { boxShadow: '0 1px 4px rgba(0,0,0,0.12)' },
    hover: { boxShadow: '0 8px 24px rgba(0,0,0,0.22)' },
  },
  {
    label: '테두리 효과',
    desc: 'border-color transition',
    base: { border: '2px solid transparent' },
    hover: { border: '2px solid #1976d2' },
  },
  {
    label: '위로 이동',
    desc: 'translateY()',
    base: { transform: 'translateY(0)' },
    hover: { transform: 'translateY(-6px)', boxShadow: '0 6px 20px rgba(0,0,0,0.15)' },
  },
  {
    label: '오버레이',
    desc: '::after pseudo overlay',
    overlay: true,
  },
]

const cardBase = {
  width: 130,
  height: 100,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 0.5,
  borderRadius: 2,
  cursor: 'pointer',
  transition: 'all 0.25s ease',
  userSelect: 'none',
  backgroundColor: '#f5f5f5',
}

const HoverSection = () => (
  <SectionBlock title="15. Hover">
    {EFFECTS.map(({ label, desc, base, hover, overlay }) => (
      <Box key={label} sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
        {overlay ? (
          <Box
            sx={{
              ...cardBase,
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: '#1976d2',
              color: '#fff',
              '&::after': {
                content: '"클릭"',
                position: 'absolute', inset: 0,
                backgroundColor: 'rgba(0,0,0,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem', fontWeight: 700, color: '#fff',
                opacity: 0,
                transition: 'opacity 0.25s',
              },
              '&:hover::after': { opacity: 1 },
            }}
          >
            <Typography variant="body2" fontWeight={600}>{label}</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              ...cardBase,
              ...base,
              '&:hover': hover,
            }}
          >
            <Typography variant="body2" fontWeight={600}>{label}</Typography>
          </Box>
        )}
        <Typography variant="caption" color="text.disabled" textAlign="center">
          {desc}
        </Typography>
      </Box>
    ))}
  </SectionBlock>
)

export default HoverSection
