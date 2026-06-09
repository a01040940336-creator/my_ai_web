import React, { useEffect, useState } from 'react'
import {
  Box, Container, Typography, Grid, Card, CardContent, CardActionArea,
  Chip, Button, Stack, Divider, Avatar
} from '@mui/material'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { formatDistanceToNow } from '../utils/dateUtils'

const SHORTCUTS = [
  { label: '자취꿀팁', color: '#3B82F6', emoji: '💡' },
  { label: '요리', color: '#F59E0B', emoji: '🍳' },
  { label: '공동구매', color: '#10B981', emoji: '🛒' },
  { label: '냉장고나눔', color: '#EC4899', emoji: '🥦' },
  { label: '동네정보', color: '#8B5CF6', emoji: '📍' },
]

const PostCard = ({ post, onClick }) => (
  <Card sx={{ height: '100%' }}>
    <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
      {post.image_url && (
        <Box
          component="img"
          src={post.image_url}
          alt="post"
          sx={{ width: '100%', height: 160, objectFit: 'cover' }}
          onError={(e) => { e.target.style.display = 'none' }}
        />
      )}
      <CardContent>
        <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
          <Chip label={post.category} size="small" sx={{ fontSize: 11 }} />
          {post.region && <Chip label={post.region} size="small" variant="outlined" icon={<LocationOnIcon sx={{ fontSize: '14px !important' }} />} sx={{ fontSize: 11 }} />}
        </Box>
        <Typography variant="subtitle2" fontWeight={600} noWrap>{post.title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: 13 }}>
          {post.content}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Avatar sx={{ width: 20, height: 20, fontSize: 11, bgcolor: 'primary.light', color: 'primary.dark' }}>
              {post.profiles?.nickname?.[0]}
            </Avatar>
            <Typography variant="caption" color="text.secondary">{post.profiles?.nickname}</Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">{formatDistanceToNow(post.created_at)}</Typography>
        </Box>
      </CardContent>
    </CardActionArea>
  </Card>
)

const HomePage = () => {
  const navigate = useNavigate()
  const [hotPosts, setHotPosts] = useState([])
  const [recentPosts, setRecentPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      const { data: hot } = await supabase
        .from('posts')
        .select('*, profiles!author_id(nickname)')
        .eq('visibility', 'public')
        .order('like_count', { ascending: false })
        .limit(3)

      const { data: recent } = await supabase
        .from('posts')
        .select('*, profiles!author_id(nickname)')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(6)

      setHotPosts(hot ?? [])
      setRecentPosts(recent ?? [])
    }
    fetchPosts()
  }, [])

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 헤로 배너 */}
      <Box sx={{
        background: 'linear-gradient(135deg, #3B82F6 0%, #34D399 100%)',
        borderRadius: 3, p: { xs: 3, md: 5 }, mb: 4, color: 'white'
      }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          우리 동네 이웃과 함께 🏘️
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
          1인 가구의 생활 문제를 함께 해결해요.<br />
          식재료 나눔, 공동구매, 생활 도움까지!
        </Typography>
        <Button variant="contained" onClick={() => navigate('/posts')} sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f0f0f0' } }}>
          게시물 둘러보기
        </Button>
      </Box>

      {/* 카테고리 바로가기 */}
      <Typography variant="h6" fontWeight={700} gutterBottom>카테고리 바로가기</Typography>
      <Stack direction="row" spacing={1.5} sx={{ mb: 4, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
        {SHORTCUTS.map(({ label, color, emoji }) => (
          <Card
            key={label}
            onClick={() => navigate(`/posts?category=${encodeURIComponent(label)}`)}
            sx={{ cursor: 'pointer', minWidth: 100, flexShrink: 0, textAlign: 'center', '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s' } }}
          >
            <CardContent sx={{ py: 2 }}>
              <Typography fontSize={28}>{emoji}</Typography>
              <Typography variant="caption" fontWeight={600} color="text.primary">{label}</Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* 인기 게시물 */}
      {hotPosts.length > 0 && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <WhatshotIcon color="error" />
            <Typography variant="h6" fontWeight={700}>인기 게시물 TOP</Typography>
          </Box>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {hotPosts.map((post) => (
              <Grid item xs={12} sm={4} key={post.id}>
                <PostCard post={post} onClick={() => navigate(`/posts/${post.id}`)} />
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ mb: 4 }} />
        </>
      )}

      {/* 최신 게시물 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>최신 게시물</Typography>
        <Button size="small" onClick={() => navigate('/posts')}>전체 보기</Button>
      </Box>
      {recentPosts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
          <Typography>아직 게시물이 없습니다. 첫 번째 글을 작성해 보세요!</Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/write')}>글 작성하기</Button>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {recentPosts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <PostCard post={post} onClick={() => navigate(`/posts/${post.id}`)} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default HomePage
