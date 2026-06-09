import React, { useEffect, useState, useRef } from 'react'
import {
  Box, Container, Typography, Card, CardContent, CardActionArea,
  Chip, Button, Stack, Divider, Avatar, IconButton
} from '@mui/material'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { formatDistanceToNow } from '../utils/dateUtils'

const BANNERS = [
  {
    title: '우리 동네 이웃과 함께 🏘️',
    desc: '1인 가구의 생활 문제를 함께 해결해요.\n식재료 나눔, 공동구매, 생활 도움까지!',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #34D399 100%)',
    btnLabel: '게시물 둘러보기',
    btnAction: 'posts',
  },
  {
    title: '청년 월세 지원금 신청하세요 💸',
    desc: '만 19~34세 1인 가구 청년을 위한\n월 최대 20만원 월세 지원 혜택!',
    gradient: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
    btnLabel: '지원 조건 확인하기',
    btnAction: 'https://www.lh.or.kr',
  },
  {
    title: '혼자 사도 건강하게 🥗',
    desc: '자취생을 위한 간편 건강식 레시피 모음\n5분 요리부터 일주일 밀프렙까지!',
    gradient: 'linear-gradient(135deg, #0369A1 0%, #34D399 100%)',
    btnLabel: '요리 게시물 보기',
    btnAction: 'posts-요리',
  },
  {
    title: '공동구매로 배달비 아끼기 🛒',
    desc: '이웃과 함께 주문하면 배달비도 나누고\n대용량도 부담 없이!',
    gradient: 'linear-gradient(135deg, #1E293B 0%, #3B82F6 100%)',
    btnLabel: '공동구매 게시물 보기',
    btnAction: 'posts-공동구매',
  },
  {
    title: '냉장고 식재료 나눔 받기 🥦',
    desc: '유통기한 임박 식재료, 버리지 말고 나눠요.\n내 동네 이웃과 함께 아끼면서 친해져요!',
    gradient: 'linear-gradient(135deg, #0F766E 0%, #34D399 100%)',
    btnLabel: '냉장고 나눔 보기',
    btnAction: 'posts-냉장고나눔',
  },
]

const HeroBanner = ({ navigate }) => {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef(null)

  const startTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % BANNERS.length)
    }, 5000)
  }

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [])

  const go = (dir) => {
    setCurrent(c => (c + dir + BANNERS.length) % BANNERS.length)
    startTimer()
  }

  const handleBtn = (action) => {
    if (action === 'posts') navigate('/posts')
    else if (action.startsWith('posts-')) navigate(`/posts?category=${encodeURIComponent(action.replace('posts-', ''))}`)
    else window.open(action, '_blank')
  }

  const b = BANNERS[current]

  return (
    <Box sx={{ position: 'relative', mb: 3, borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{
        background: b.gradient,
        /* 화살표 버튼(48px) 너비 확보 */
        px: { xs: 7, sm: 8, md: 10 },
        py: { xs: 3, sm: 4, md: 5 },
        color: 'white',
        transition: 'background 0.6s ease',
        minHeight: { xs: 170, sm: 210 },
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        <Typography variant="h4" fontWeight={800} gutterBottom
          sx={{ fontSize: { xs: '1.15rem', sm: '1.8rem', md: '2rem' }, whiteSpace: 'pre-line', lineHeight: 1.3 }}>
          {b.title}
        </Typography>
        <Typography variant="body1"
          sx={{ opacity: 0.92, mb: 2.5, fontSize: { xs: '0.8rem', sm: '0.95rem', md: '1rem' }, whiteSpace: 'pre-line', lineHeight: 1.7 }}>
          {b.desc}
        </Typography>
        <Button variant="contained" size="small" onClick={() => handleBtn(b.btnAction)}
          sx={{ bgcolor: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(4px)', color: 'white', border: '1px solid rgba(255,255,255,0.45)', alignSelf: 'flex-start', fontWeight: 600, '&:hover': { bgcolor: 'rgba(255,255,255,0.35)' } }}>
          {b.btnLabel}
        </Button>
      </Box>

      {/* 이전/다음 화살표 */}
      <IconButton onClick={() => go(-1)} size="small"
        sx={{ position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.28)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.48)' }, zIndex: 1 }}>
        <ChevronLeftIcon fontSize="small" />
      </IconButton>
      <IconButton onClick={() => go(1)} size="small"
        sx={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.28)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.48)' }, zIndex: 1 }}>
        <ChevronRightIcon fontSize="small" />
      </IconButton>

      {/* 인디케이터 */}
      <Box sx={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 0.8, zIndex: 1 }}>
        {BANNERS.map((_, i) => (
          <Box key={i} onClick={() => { setCurrent(i); startTimer() }}
            sx={{ width: i === current ? 20 : 8, height: 8, borderRadius: 4, bgcolor: i === current ? 'white' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.3s ease' }}
          />
        ))}
      </Box>
    </Box>
  )
}

const SHORTCUTS = [
  { label: '자취꿀팁', emoji: '💡' },
  { label: '요리', emoji: '🍳' },
  { label: '공동구매', emoji: '🛒' },
  { label: '냉장고나눔', emoji: '🥦' },
  { label: '동네정보', emoji: '📍' },
]

const CATEGORY_BG = {
  '자취꿀팁': '#F0F5FF', '요리': '#FFF7ED', '공동구매': '#F0FDF4',
  '냉장고나눔': '#F0FDFA', '동네정보': '#EFF6FF', '동네모임': '#F5F3FF',
  '질문게시판': '#F8FAFC', '공지사항': '#EFF6FF',
}
const CATEGORY_EMOJI = { '자취꿀팁':'💡','요리':'🍳','공동구매':'🛒','냉장고나눔':'🥦','동네정보':'📍','동네모임':'🤝','질문게시판':'❓','공지사항':'📢' }

const PostCard = ({ post, onClick }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid', borderColor: 'divider', boxShadow: 'none', '&:hover': { boxShadow: 2 }, transition: 'box-shadow 0.2s' }}>
    <CardActionArea onClick={onClick} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
      <Box sx={{ position: 'relative', height: 160, flexShrink: 0, overflow: 'hidden' }}>
        {post.image_url ? (
          <Box component="img" src={post.image_url} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => { e.target.style.display = 'none' }}
          />
        ) : (
          <Box sx={{ width: '100%', height: '100%', bgcolor: CATEGORY_BG[post.category] || '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: 48, lineHeight: 1 }}>{CATEGORY_EMOJI[post.category] || '📝'}</Typography>
            {post.category === '동네정보' && post.region && (
              <Typography sx={{ color: 'text.secondary', fontWeight: 700, fontSize: 13 }}>
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
          <Chip label={post.category} size="small" color="primary" sx={{ fontSize: 11, fontWeight: 600, opacity: 0.92 }} />
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
      {/* 슬라이딩 배너 */}
      <HeroBanner navigate={navigate} />

      {/* 카테고리 바로가기 */}
      <Typography variant="h6" fontWeight={700} gutterBottom>카테고리 바로가기</Typography>
      <Box sx={{
        display: 'flex', flexWrap: { xs: 'nowrap', md: 'nowrap' },
        gap: 1.5, mb: 4, pb: 1,
        overflowX: { xs: 'auto', md: 'visible' },
        '&::-webkit-scrollbar': { display: 'none' },
      }}>
        {SHORTCUTS.map(({ label, emoji }) => (
          <Card
            key={label}
            onClick={() => navigate(`/posts?category=${encodeURIComponent(label)}`)}
            sx={{
              cursor: 'pointer',
              flexShrink: 0,
              flex: { xs: '0 0 100px', md: '1 1 0' },
              textAlign: 'center',
              bgcolor: 'background.paper',
              border: '1.5px solid',
              borderColor: 'divider',
              '&:hover': {
                borderColor: 'primary.main',
                transform: 'translateY(-3px)',
                transition: 'all 0.2s',
                boxShadow: 2,
                '& .cat-label': { color: 'primary.main' },
              },
            }}
          >
            <CardContent sx={{ py: 2, px: 1 }}>
              <Typography fontSize={28}>{emoji}</Typography>
              <Typography className="cat-label" variant="caption" fontWeight={600} color="text.primary" sx={{ display: 'block', mt: 0.5, transition: 'color 0.2s' }}>
                {label}
              </Typography>
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
