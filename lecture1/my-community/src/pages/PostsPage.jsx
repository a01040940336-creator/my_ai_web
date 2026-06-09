import React, { useEffect, useState } from 'react'
import {
  Container, Box, Typography, Card, CardContent, CardActionArea,
  Chip, Select, MenuItem, FormControl, InputLabel, Avatar, Stack,
  TextField, InputAdornment, Button
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import EditIcon from '@mui/icons-material/Edit'
import { useNavigate, useSearchParams } from 'react-router-dom'
import CategoryBar from '../components/common/CategoryBar'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'
import { formatDistanceToNow } from '../utils/dateUtils'

const STATUS_COLOR = { '모집중': 'primary', '진행중': 'warning', '마감완료': 'default' }

const CATEGORY_META = {
  '자취꿀팁':  { emoji: '💡', gradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)' },
  '요리':      { emoji: '🍳', gradient: 'linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%)' },
  '공동구매':  { emoji: '🛒', gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)' },
  '냉장고나눔':{ emoji: '🥦', gradient: 'linear-gradient(135deg, #EC4899 0%, #F9A8D4 100%)' },
  '동네정보':  { emoji: '📍', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #C4B5FD 100%)' },
  '동네모임':  { emoji: '🤝', gradient: 'linear-gradient(135deg, #0EA5E9 0%, #7DD3FC 100%)' },
  '질문게시판':{ emoji: '❓', gradient: 'linear-gradient(135deg, #64748B 0%, #94A3B8 100%)' },
}

const PostCard = ({ post, onClick }) => {
  const meta = CATEGORY_META[post.category] || { emoji: '📝', gradient: 'linear-gradient(135deg, #94A3B8 0%, #CBD5E1 100%)' }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea onClick={onClick} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        {/* 이미지 or 플레이스홀더 — 항상 160px */}
        <Box sx={{ position: 'relative', height: 160, flexShrink: 0, overflow: 'hidden' }}>
          {post.image_url ? (
            <Box
              component="img"
              src={post.image_url}
              alt=""
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.parentNode.style.background = meta.gradient
              }}
            />
          ) : (
            <Box sx={{
              width: '100%', height: '100%', background: meta.gradient,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.5,
            }}>
              <Typography sx={{ fontSize: 44, lineHeight: 1 }}>{meta.emoji}</Typography>
              {post.category === '동네정보' && post.region && (
                <Typography sx={{ color: 'white', fontWeight: 800, fontSize: 15, textShadow: '0 1px 4px rgba(0,0,0,0.4)', letterSpacing: 1 }}>
                  📍 {post.region}
                </Typography>
              )}
            </Box>
          )}
          {/* 동네정보 이미지 있을 때 지역명 오버레이 */}
          {post.category === '동네정보' && post.region && post.image_url && (
            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, px: 1.5, py: 1, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)' }}>
              <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 13 }}>📍 {post.region}</Typography>
            </Box>
          )}
          {/* 카테고리 칩 오버레이 */}
          <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 0.5 }}>
            {post.category && (
              <Chip label={post.category} size="small"
                sx={{ bgcolor: 'rgba(0,0,0,0.55)', color: 'white', fontSize: 11, fontWeight: 600, backdropFilter: 'blur(4px)' }} />
            )}
            {post.post_type !== '일반' && (
              <Chip label={post.status} size="small" color={STATUS_COLOR[post.status]} sx={{ fontSize: 11, fontWeight: 600 }} />
            )}
          </Box>
        </Box>

        {/* 콘텐츠 */}
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {post.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{
            flex: 1, fontSize: 12, lineHeight: 1.5,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
          }}>
            {post.content}
          </Typography>

          {/* 하단 정보 */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
              <Avatar sx={{ width: 18, height: 18, fontSize: 10, bgcolor: 'primary.light', color: 'primary.dark', flexShrink: 0 }}>
                {post.profiles?.nickname?.[0]}
              </Avatar>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 80 }}>
                {post.profiles?.nickname ?? '익명'}
              </Typography>
              {post.region && (
                <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <LocationOnIcon sx={{ fontSize: 11, color: 'text.disabled' }} />
                  <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10 }}>{post.region}</Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
              <FavoriteBorderIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
              <Typography variant="caption" color="text.disabled">{post.like_count}</Typography>
              <Typography variant="caption" color="text.disabled" sx={{ ml: 0.5 }}>{formatDistanceToNow(post.created_at)}</Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

const PostsPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('newest')
  const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '')

  const category = searchParams.get('category')
  const searchKeyword = searchParams.get('search')

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      let query = supabase
        .from('posts')
        .select('*, profiles!author_id(nickname, region)')
        .eq('visibility', 'public')

      if (category) query = query.eq('category', category)
      if (searchKeyword) query = query.ilike('title', `%${searchKeyword}%`)
      if (sort === 'newest') query = query.order('created_at', { ascending: false })
      else if (sort === 'popular') query = query.order('like_count', { ascending: false })

      const { data } = await query.limit(30)
      setPosts(data ?? [])
      setLoading(false)
    }
    fetchPosts()
  }, [category, searchKeyword, sort])

  const handleSearch = (e) => {
    if (e.key === 'Enter' && localSearch.trim()) {
      navigate(`/posts?search=${encodeURIComponent(localSearch.trim())}`)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 1.5, sm: 2 } }}>
      {/* 필터 바 */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={700} sx={{ flexShrink: 0, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          {category ? `#${category}` : searchKeyword ? `"${searchKeyword}" 검색 결과` : '전체 게시물'}
        </Typography>
        <TextField
          size="small"
          placeholder="검색..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          onKeyDown={handleSearch}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          sx={{ flex: 1, minWidth: 120, maxWidth: { xs: '100%', sm: 260 } }}
        />
        <Box sx={{ display: 'flex', gap: 1, ml: { xs: 0, sm: 'auto' }, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>정렬</InputLabel>
            <Select value={sort} label="정렬" onChange={(e) => setSort(e.target.value)}>
              <MenuItem value="newest">최신순</MenuItem>
              <MenuItem value="popular">인기순</MenuItem>
            </Select>
          </FormControl>
          {user && (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              size="small"
              onClick={() => navigate('/write')}
              sx={{ flexShrink: 0, fontWeight: 700 }}
            >
              글 작성
            </Button>
          )}
        </Box>
      </Box>

      <CategoryBar />

      <Box sx={{ mt: 2 }}>
        {loading ? (
          <Typography color="text.secondary" textAlign="center" py={6}>불러오는 중...</Typography>
        ) : posts.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography color="text.secondary" mb={2}>게시물이 없습니다.</Typography>
            <Button variant="contained" onClick={() => navigate('/write')}>첫 글 작성하기</Button>
          </Box>
        ) : (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 2,
          }}>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onClick={() => navigate(`/posts/${post.id}`)} />
            ))}
          </Box>
        )}
      </Box>
    </Container>
  )
}

export default PostsPage
