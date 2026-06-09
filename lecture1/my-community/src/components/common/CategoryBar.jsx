import React from 'react'
import { Box, Chip } from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'

const CATEGORIES = ['전체', '자취꿀팁', '요리', '공동구매', '냉장고나눔', '동네정보', '동네모임', '질문게시판']

const CategoryBar = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const current = searchParams.get('category') || '전체'

  const handleClick = (cat) => {
    if (cat === '전체') navigate('/posts')
    else navigate(`/posts?category=${encodeURIComponent(cat)}`)
  }

  return (
    <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', py: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
      {CATEGORIES.map((cat) => (
        <Chip
          key={cat}
          label={cat}
          onClick={() => handleClick(cat)}
          color={current === cat ? 'primary' : 'default'}
          variant={current === cat ? 'filled' : 'outlined'}
          size="small"
          sx={{ cursor: 'pointer', flexShrink: 0, fontWeight: current === cat ? 600 : 400 }}
        />
      ))}
    </Box>
  )
}

export default CategoryBar
