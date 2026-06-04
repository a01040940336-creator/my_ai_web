import React, { useState } from 'react'
import { Box, Paper, Typography, Chip } from '@mui/material'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import SectionBlock from './SectionBlock'

const INITIAL_ITEMS = [
  { id: 1, label: 'React 공부하기',     color: '#61dafb' },
  { id: 2, label: 'TypeScript 실습',    color: '#3178c6' },
  { id: 3, label: 'MUI 컴포넌트 정리',  color: '#1976d2' },
  { id: 4, label: 'Git 커밋 & 푸시',    color: '#f05032' },
  { id: 5, label: '코드 리뷰 요청',     color: '#6e40c9' },
]

const ZONES = [
  { key: 'todo',  label: '할 일',  chipColor: 'default', borderColor: '#1976d2', bgColor: '#e3f2fd' },
  { key: 'done',  label: '완료',   chipColor: 'success',  borderColor: '#2e7d32', bgColor: '#e8f5e9' },
]

const DragDropSection = () => {
  const [items, setItems] = useState({ todo: INITIAL_ITEMS, done: [] })
  const [dragging, setDragging] = useState(null)
  const [overZone, setOverZone] = useState(null)

  const handleDragStart = (e, id, from) => {
    setDragging({ id, from })
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, zone) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (overZone !== zone) setOverZone(zone)
  }

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setOverZone(null)
  }

  const handleDrop = (e, to) => {
    e.preventDefault()
    setOverZone(null)
    if (!dragging || dragging.from === to) return

    const { id, from } = dragging
    const item = items[from].find((i) => i.id === id)

    setItems((prev) => ({
      ...prev,
      [from]: prev[from].filter((i) => i.id !== id),
      [to]: [...prev[to], item],
    }))
    setDragging(null)
  }

  const handleDragEnd = () => {
    setDragging(null)
    setOverZone(null)
  }

  return (
    <SectionBlock title="10. Drag & Drop">
      <Box sx={{ width: '100%', display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {ZONES.map(({ key, label, chipColor, borderColor, bgColor }) => (
          <Box
            key={key}
            sx={{ flex: 1, minWidth: 220 }}
            onDragOver={(e) => handleDragOver(e, key)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, key)}
          >
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                minHeight: 220,
                borderColor: overZone === key ? borderColor : 'divider',
                borderWidth: overZone === key ? 2 : 1,
                backgroundColor: overZone === key ? bgColor : 'background.default',
                transition: 'border-color 0.15s, background-color 0.15s',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={700}>{label}</Typography>
                <Chip label={items[key].length} size="small" color={chipColor} />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {items[key].length === 0 ? (
                  <Typography
                    variant="body2"
                    color="text.disabled"
                    textAlign="center"
                    sx={{ mt: 4, userSelect: 'none' }}
                  >
                    여기에 드롭하세요
                  </Typography>
                ) : (
                  items[key].map((item) => (
                    <Box
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.id, key)}
                      onDragEnd={handleDragEnd}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1.5,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        backgroundColor: 'background.paper',
                        opacity: dragging?.id === item.id ? 0.35 : 1,
                        cursor: 'grab',
                        transition: 'opacity 0.15s',
                        '&:active': { cursor: 'grabbing' },
                        userSelect: 'none',
                      }}
                    >
                      <DragIndicatorIcon sx={{ color: 'text.disabled', fontSize: 18, flexShrink: 0 }} />
                      <Box
                        sx={{
                          width: 8, height: 8, borderRadius: '50%',
                          backgroundColor: item.color, flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2">{item.label}</Typography>
                    </Box>
                  ))
                )}
              </Box>
            </Paper>
          </Box>
        ))}
      </Box>
    </SectionBlock>
  )
}

export default DragDropSection
