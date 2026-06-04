import React, { useState } from 'react'
import {
  Box, Card, CardMedia, CardContent, CardActions,
  Typography, Button, Grid, Chip,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'
import SectionBlock from './SectionBlock'

const CARDS = [
  {
    id: 1,
    title: 'React',
    subtitle: '프론트엔드 라이브러리',
    description: 'Meta가 만든 UI 라이브러리. 컴포넌트 기반으로 재사용 가능한 UI를 효율적으로 구성할 수 있어요.',
    color: '#61dafb',
    tag: 'JavaScript',
  },
  {
    id: 2,
    title: 'TypeScript',
    subtitle: '정적 타입 언어',
    description: 'JavaScript의 슈퍼셋으로, 정적 타입을 통해 코드 안정성과 개발 생산성을 높여줘요.',
    color: '#3178c6',
    tag: 'Language',
  },
  {
    id: 3,
    title: 'Material UI',
    subtitle: 'React UI 프레임워크',
    description: 'Google Material Design 기반의 React 컴포넌트 라이브러리. 빠르고 일관된 UI 개발이 가능해요.',
    color: '#1976d2',
    tag: 'Library',
  },
  {
    id: 4,
    title: 'Vite',
    subtitle: '차세대 빌드 툴',
    description: 'ESM 기반의 초고속 개발 서버와 빌드 도구. HMR 속도가 빨라 개발 경험이 탁월해요.',
    color: '#646cff',
    tag: 'Tool',
  },
]

const CardSection = () => {
  const [hovered, setHovered] = useState(null)
  const [liked, setLiked] = useState([])

  const toggleLike = (id) => {
    setLiked((prev) => prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id])
  }

  return (
    <SectionBlock title="09. Card">
      <Box sx={{ width: '100%' }}>
        <Grid container spacing={3}>
          {CARDS.map(({ id, title, subtitle, description, color, tag }) => (
            <Grid item xs={12} sm={6} md={3} key={id}>
              <Card
                elevation={hovered === id ? 8 : 2}
                onMouseEnter={() => setHovered(id)}
                onMouseLeave={() => setHovered(null)}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'elevation 0.2s, transform 0.2s',
                  transform: hovered === id ? 'translateY(-4px)' : 'none',
                  cursor: 'pointer',
                }}
              >
                <CardMedia
                  sx={{
                    height: 100,
                    backgroundColor: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h4" fontWeight={700} color="white">
                    {title[0]}
                  </Typography>
                </CardMedia>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="h6" fontWeight={700}>
                      {title}
                    </Typography>
                    <Chip label={tag} size="small" sx={{ fontSize: '0.65rem' }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {subtitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {description}
                  </Typography>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    size="small"
                    startIcon={<FavoriteIcon />}
                    color={liked.includes(id) ? 'error' : 'inherit'}
                    onClick={() => toggleLike(id)}
                  >
                    {liked.includes(id) ? '좋아요 취소' : '좋아요'}
                  </Button>
                  <Button size="small" startIcon={<ShareIcon />} color="inherit">
                    공유
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </SectionBlock>
  )
}

export default CardSection
