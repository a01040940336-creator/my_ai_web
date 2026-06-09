import React, { useEffect, useState } from 'react'
import {
  Container, Grid, Card, CardContent, Typography, Avatar, Box,
  Tab, Tabs, TextField, Button, Stack, Divider, Chip, CardActionArea, Alert
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'
import { formatDistanceToNow } from '../utils/dateUtils'

const PostMiniCard = ({ post, onClick }) => (
  <Card sx={{ mb: 1.5 }}>
    <CardActionArea onClick={onClick}>
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} noWrap>{post.title}</Typography>
            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.3, alignItems: 'center' }}>
              {post.category && <Chip label={post.category} size="small" sx={{ fontSize: 10, height: 18 }} />}
              <Typography variant="caption" color="text.disabled">{formatDistanceToNow(post.created_at)}</Typography>
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary" ml={1}>좋아요 {post.like_count}</Typography>
        </Box>
      </CardContent>
    </CardActionArea>
  </Card>
)

const MyPage = () => {
  const navigate = useNavigate()
  const { user, profile, fetchProfile, signOut } = useAuth()
  const [tab, setTab] = useState(0)
  const [myPosts, setMyPosts] = useState([])
  const [bookmarkedPosts, setBookmarkedPosts] = useState([])
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ nickname: '', region: '' })
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (user) {
      fetchMyPosts()
      fetchBookmarks()
      setEditForm({ nickname: profile?.nickname ?? '', region: profile?.region ?? '' })
    }
  }, [user, profile])

  const fetchMyPosts = async () => {
    const { data } = await supabase.from('posts').select('*').eq('author_id', user.id).order('created_at', { ascending: false })
    setMyPosts(data ?? [])
  }

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from('bookmarks')
      .select('post_id, posts(id, title, category, like_count, created_at)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setBookmarkedPosts(data?.map(b => b.posts).filter(Boolean) ?? [])
  }

  const handleSaveProfile = async () => {
    setSaveLoading(true)
    setSaveError('')
    const { error } = await supabase.from('profiles').update({
      nickname: editForm.nickname,
      region: editForm.region,
    }).eq('id', user.id)

    if (error) { setSaveError(error.message) }
    else {
      await fetchProfile(user.id)
      setEditing(false)
    }
    setSaveLoading(false)
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* 프로필 카드 */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Avatar sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: 28, mx: 'auto', mb: 2 }}>
                {profile?.nickname?.[0] ?? user?.email?.[0]?.toUpperCase()}
              </Avatar>

              {editing ? (
                <Stack spacing={1.5} sx={{ textAlign: 'left' }}>
                  {saveError && <Alert severity="error" sx={{ fontSize: 12 }}>{saveError}</Alert>}
                  <TextField label="닉네임" size="small" fullWidth value={editForm.nickname} onChange={(e) => setEditForm(f => ({ ...f, nickname: e.target.value }))} />
                  <TextField label="관심 지역" size="small" fullWidth value={editForm.region} onChange={(e) => setEditForm(f => ({ ...f, region: e.target.value }))} />
                  <Stack direction="row" spacing={1}>
                    <Button variant="contained" size="small" fullWidth onClick={handleSaveProfile} disabled={saveLoading}>저장</Button>
                    <Button variant="outlined" size="small" fullWidth onClick={() => setEditing(false)}>취소</Button>
                  </Stack>
                </Stack>
              ) : (
                <>
                  <Typography variant="h6" fontWeight={700}>{profile?.nickname ?? '닉네임 없음'}</Typography>
                  <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
                  {profile?.region && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.5 }}>
                      <LocationOnIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                      <Typography variant="caption" color="primary.main">{profile.region}</Typography>
                    </Box>
                  )}
                  <Button startIcon={<EditIcon />} size="small" sx={{ mt: 2 }} onClick={() => setEditing(true)} fullWidth variant="outlined">
                    프로필 수정
                  </Button>
                </>
              )}

              <Divider sx={{ my: 2 }} />
              <Stack direction="row" justifyContent="space-around">
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight={700}>{myPosts.length}</Typography>
                  <Typography variant="caption" color="text.secondary">게시물</Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight={700}>{bookmarkedPosts.length}</Typography>
                  <Typography variant="caption" color="text.secondary">북마크</Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />
              <Stack spacing={1}>
                <Button size="small" fullWidth variant="outlined" color="error" onClick={handleLogout}>로그아웃</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* 콘텐츠 */}
        <Grid item xs={12} md={8}>
          <Card>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
              <Tab label="내 게시물" />
              <Tab label="북마크" />
            </Tabs>
            <CardContent sx={{ pt: 2 }}>
              {tab === 0 && (
                myPosts.length === 0
                  ? <Box textAlign="center" py={4}><Typography color="text.secondary">작성한 게시물이 없습니다.</Typography><Button sx={{ mt: 1 }} variant="contained" onClick={() => navigate('/write')}>첫 글 작성하기</Button></Box>
                  : myPosts.map(post => <PostMiniCard key={post.id} post={post} onClick={() => navigate(`/posts/${post.id}`)} />)
              )}
              {tab === 1 && (
                bookmarkedPosts.length === 0
                  ? <Box textAlign="center" py={4}><Typography color="text.secondary">북마크한 게시물이 없습니다.</Typography></Box>
                  : bookmarkedPosts.map(post => <PostMiniCard key={post.id} post={post} onClick={() => navigate(`/posts/${post.id}`)} />)
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default MyPage
