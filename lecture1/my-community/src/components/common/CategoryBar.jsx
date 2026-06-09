import React from 'react'
import { Box, Chip } from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'

const CATEGORIES = [
  { label: '전체', emoji: '🏠' },
  { label: '자취꿀팁', emoji: '💡' },
  { label: '요리', emoji: '🍳' },
  { label: '공동구매', emoji: '🛒' },
  { label: '냉장고나눔', emoji: '🥦' },
  { label: '동네정보', emoji: '📍' },
  { label: '동네모임', emoji: '🤝' },
  { label: '질문게시판', emoji: '❓' },
]

const CategoryBar = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const current = searchParams.get('category') || '전체'

  const handleClick = (cat) => {
    if (cat === '전체') navigate('/posts')
    else navigate(`/posts?category=${encodeURIComponent(cat)}`)
  }

  return (
    <Box sx={{
      display: 'flex',
      gap: 1,
      py: 1.5,
      flexWrap: { xs: 'nowrap', md: 'wrap' },
      overflowX: { xs: 'auto', md: 'visible' },
      justifyContent: { xs: 'flex-start', md: 'center' },
      '&::-webkit-scrollbar': { display: 'none' },
    }}>
      {CATEGORIES.map(({ label, emoji }) => {
        const isActive = current === label
        return (
          <Chip
            key={label}
            label={`${emoji} ${label}`}
            onClick={() => handleClick(label)}
            color={isActive ? 'primary' : 'default'}
            variant={isActive ? 'filled' : 'outlined'}
            sx={{
              cursor: 'pointer',
              flexShrink: 0,
              fontWeight: isActive ? 700 : 500,
              fontSize: 13,
              height: 36,
              px: 0.5,
              borderWidth: isActive ? 0 : 1.5,
              '&:hover': {
                bgcolor: isActive ? 'primary.dark' : 'primary.light',
                color: isActive ? 'white' : 'primary.dark',
                borderColor: 'primary.main',
              },
              transition: 'all 0.15s ease',
            }}
          />
        )
      })}
    </Box>
  )
}

export default CategoryBar
