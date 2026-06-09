import React, { useEffect, useState } from 'react'
import {
  Container, Box, Typography, Grid, Card, CardContent, CardActionArea,
  Chip, Select, MenuItem, FormControl, InputLabel, Avatar, Stack,
  TextField, InputAdornment, Button
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import { useNavigate, useSearchParams } from 'react-router-dom'
import CategoryBar from '../components/common/CategoryBar'
import { supabase } from '../supabase'
import { formatDistanceToNow } from '../utils/dateUtils'

const STATUS_COLOR = { '모집중': 'primary', '진행중': 'warning', '마감완료': 'default' }

const PostsPage = () => {
  const navigate = useNavigate()
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
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={700} sx={{ flexShrink: 0 }}>
          {category ? `#${category}` : searchKeyword ? `"${searchKeyword}" 검색 결과` : '전체 게시물'}
        </Typography>
        <TextField
          size="small"
          placeholder="게시물 검색..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          onKeyDown={handleSearch}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          sx={{ maxWidth: 260 }}
        />
        <FormControl size="small" sx={{ minWidth: 120, ml: 'auto' }}>
          <InputLabel>정렬</InputLabel>
          <Select value={sort} label="정렬" onChange={(e) => setSort(e.target.value)}>
            <MenuItem value="newest">최신순</MenuItem>
            <MenuItem value="popular">인기순</MenuItem>
          </Select>
        </FormControl>
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
          <Grid container spacing={2}>
            {posts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <Card sx={{ height: '100%' }}>
                  <CardActionArea onClick={() => navigate(`/posts/${post.id}`)} sx={{ height: '100%' }}>
                    {post.image_url && (
                      <Box component="img" src={post.image_url} alt="" sx={{ width: '100%', height: 160, objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none' }} />
                    )}
                    <CardContent>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" mb={1}>
                        {post.category && <Chip label={post.category} size="small" sx={{ fontSize: 11 }} />}
                        {post.post_type !== '일반' && (
                          <Chip label={post.status} size="small" color={STATUS_COLOR[post.status]} sx={{ fontSize: 11 }} />
                        )}
                      </Stack>
                      <Typography variant="subtitle2" fontWeight={600} noWrap>{post.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: 13, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {post.content}
                      </Typography>
                      <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Avatar sx={{ width: 18, height: 18, fontSize: 10, bgcolor: 'primary.light', color: 'primary.dark' }}>
                            {post.profiles?.nickname?.[0]}
                          </Avatar>
                          <Typography variant="caption" color="text.secondary">{post.profiles?.nickname}</Typography>
                          {post.region && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LocationOnIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
                              <Typography variant="caption" color="text.disabled" fontSize={11}>{post.region}</Typography>
                            </Box>
                          )}
                        </Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                            <FavoriteBorderIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
                            <Typography variant="caption" color="text.disabled">{post.like_count}</Typography>
                          </Box>
                          <Typography variant="caption" color="text.disabled">{formatDistanceToNow(post.created_at)}</Typography>
                        </Stack>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  )
}

export default PostsPage
