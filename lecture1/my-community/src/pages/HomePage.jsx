import React, { useEffect, useState } from 'react'
import {
  Box, Container, Typography, Card, CardContent, CardActionArea,
  Chip, Button, Stack, Divider, Avatar
} from '@mui/material'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { formatDistanceToNow } from '../utils/dateUtils'

const SHORTCUTS = [
  { label: '자취꿀팁', gradient: 'linear-gradient(135deg,#3B82F6,#60A5FA)', emoji: '💡' },
  { label: '요리', gradient: 'linear-gradient(135deg,#F59E0B,#FCD34D)', emoji: '🍳' },
  { label: '공동구매', gradient: 'linear-gradient(135deg,#10B981,#34D399)', emoji: '🛒' },
  { label: '냉장고나눔', gradient: 'linear-gradient(135deg,#EC4899,#F9A8D4)', emoji: '🥦' },
  { label: '동네정보', gradient: 'linear-gradient(135deg,#8B5CF6,#C4B5FD)', emoji: '📍' },
]

const CATEGORY_GRADIENT = {
  '자취꿀팁':  'linear-gradient(135deg,#3B82F6,#60A5FA)',
  '요리':      'linear-gradient(135deg,#F59E0B,#FCD34D)',
  '공동구매':  'linear-gradient(135deg,#10B981,#34D399)',
  '냉장고나눔':'linear-gradient(135deg,#EC4899,#F9A8D4)',
  '동네정보':  'linear-gradient(135deg,#8B5CF6,#C4B5FD)',
  '동네모임':  'linear-gradient(135deg,#0EA5E9,#7DD3FC)',
  '질문게시판':'linear-gradient(135deg,#64748B,#94A3B8)',
}
const CATEGORY_EMOJI = { '자취꿀팁':'💡','요리':'🍳','공동구매':'🛒','냉장고나눔':'🥦','동네정보':'📍','동네모임':'🤝','질문게시판':'❓' }

const PostCard = ({ post, onClick }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardActionArea onClick={onClick} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
      <Box sx={{ position: 'relative', height: 160, flexShrink: 0, overflow: 'hidden' }}>
        {post.image_url ? (
          <Box component="img" src={post.image_url} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.style.background = CATEGORY_GRADIENT[post.category] || '#94A3B8' }}
          />
        ) : (
          <Box sx={{ width: '100%', height: '100%', background: CATEGORY_GRADIENT[post.category] || 'linear-gradient(135deg,#94A3B8,#CBD5E1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: 44, lineHeight: 1 }}>{CATEGORY_EMOJI[post.category] || '📝'}</Typography>
            {post.category === '동네정보' && post.region && (
              <Typography sx={{ color: 'white', fontWeight: 800, fontSize: 15, textShadow: '0 1px 4px rgba(0,0,0,0.4)', letterSpacing: 1 }}>
                📍 {post.region}
              </Typography>
            )}
          </Box>
        )}
        {/* 동네정보: 이미지 위에도 지역명 오버레이 */}
        {post.category === '동네정보' && post.region && post.image_url && (
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, px: 1.5, py: 1, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)' }}>
            <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 13 }}>📍 {post.region}</Typography>
          </Box>
        )}
        <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
          <Chip label={post.category} size="small" sx={{ bgcolor: 'rgba(0,0,0,0.55)', color: 'white', fontSize: 11, fontWeight: 600 }} />
        </Box>
      </Box>
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ flex: 1, fontSize: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {post.content}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Avatar sx={{ width: 18, height: 18, fontSize: 10, bgcolor: 'primary.light', color: 'primary.dark' }}>
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
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1.5, sm: 2 } }}>
      {/* 헤로 배너 */}
      <Box sx={{
        background: 'linear-gradient(135deg, #3B82F6 0%, #34D399 100%)',
        borderRadius: 3, p: { xs: 2.5, sm: 3, md: 5 }, mb: 3, color: 'white'
      }}>
        <Typography variant="h4" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '1.4rem', sm: '2.125rem' } }}>
          우리 동네 이웃과 함께 🏘️
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, mb: 2, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          1인 가구의 생활 문제를 함께 해결해요.<br />
          식재료 나눔, 공동구매, 생활 도움까지!
        </Typography>
        <Button variant="contained" onClick={() => navigate('/posts')} sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f0f0f0' } }}>
          게시물 둘러보기
        </Button>
      </Box>

      {/* 카테고리 바로가기 */}
      <Typography variant="h6" fontWeight={700} gutterBottom>카테고리 바로가기</Typography>
      <Box sx={{
        display: 'flex', flexWrap: { xs: 'nowrap', md: 'nowrap' },
        gap: 1.5, mb: 4, pb: 1,
        overflowX: { xs: 'auto', md: 'visible' },
        '&::-webkit-scrollbar': { display: 'none' },
      }}>
        {SHORTCUTS.map(({ label, gradient, emoji }) => (
          <Card
            key={label}
            onClick={() => navigate(`/posts?category=${encodeURIComponent(label)}`)}
            sx={{
              cursor: 'pointer',
              flexShrink: 0,
              flex: { xs: '0 0 100px', md: '1 1 0' },
              textAlign: 'center', background: gradient, color: 'white',
              '&:hover': { transform: 'translateY(-3px)', transition: 'transform 0.2s', boxShadow: 4 },
            }}
          >
            <CardContent sx={{ py: 2, px: 1 }}>
              <Typography fontSize={30}>{emoji}</Typography>
              <Typography variant="caption" fontWeight={700} color="white" sx={{ display: 'block', mt: 0.5 }}>{label}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* 인기 게시물 */}
      {hotPosts.length > 0 && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <WhatshotIcon color="error" />
            <Typography variant="h6" fontWeight={700}>인기 게시물 TOP</Typography>
          </Box>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 2, mb: 4,
          }}>
            {hotPosts.map((post) => (
              <PostCard key={post.id} post={post} onClick={() => navigate(`/posts/${post.id}`)} />
            ))}
          </Box>
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
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 2,
        }}>
          {recentPosts.map((post) => (
            <PostCard key={post.id} post={post} onClick={() => navigate(`/posts/${post.id}`)} />
          ))}
        </Box>
      )}
    </Container>
  )
}

export default HomePage
