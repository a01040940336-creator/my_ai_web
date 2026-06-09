import React, { useEffect, useState } from 'react'
import {
  Container, Box, Typography, Avatar, Chip, Divider, Button,
  TextField, IconButton, Stack, Card, CardContent, Alert
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SendIcon from '@mui/icons-material/Send'
import EditIcon from '@mui/icons-material/Edit'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'
import { formatDistanceToNow } from '../utils/dateUtils'

const CommentItem = ({ comment, onLike, isLiked }) => (
  <Box sx={{ pl: comment.parent_id ? 4 : 0, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
      <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: 'primary.light', color: 'primary.dark' }}>
        {comment.profiles?.nickname?.[0]}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography variant="caption" fontWeight={600}>{comment.profiles?.nickname}</Typography>
          <Typography variant="caption" color="text.disabled">{formatDistanceToNow(comment.created_at)}</Typography>
        </Box>
        <Typography variant="body2">{comment.content}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
          <IconButton size="small" onClick={() => onLike(comment.id)}>
            {isLiked ? <FavoriteIcon sx={{ fontSize: 14, color: 'error.main' }} /> : <FavoriteBorderIcon sx={{ fontSize: 14 }} />}
          </IconButton>
          <Typography variant="caption" color="text.secondary">{comment.like_count}</Typography>
        </Box>
      </Box>
    </Box>
  </Box>
)

const PostDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [likedComments, setLikedComments] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
    fetchComments()
    if (user) fetchUserInteractions()
  }, [id, user])

  const fetchPost = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles!author_id(nickname, region, avatar_url)')
      .eq('id', id)
      .single()
    setPost(data)
    setLoading(false)
  }

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles!author_id(nickname)')
      .eq('post_id', id)
      .order('created_at', { ascending: true })
    setComments(data ?? [])
  }

  const fetchUserInteractions = async () => {
    const [{ data: likeData }, { data: bookmarkData }, { data: commentLikesData }] = await Promise.all([
      supabase.from('post_likes').select('post_id').eq('user_id', user.id).eq('post_id', id),
      supabase.from('bookmarks').select('post_id').eq('user_id', user.id).eq('post_id', id),
      supabase.from('comment_likes').select('comment_id').eq('user_id', user.id),
    ])
    setLiked(likeData?.length > 0)
    setBookmarked(bookmarkData?.length > 0)
    setLikedComments(new Set(commentLikesData?.map(r => r.comment_id) ?? []))
  }

  const handleLike = async () => {
    if (!user) { navigate('/login'); return }
    if (liked) {
      await supabase.from('post_likes').delete().eq('user_id', user.id).eq('post_id', id)
      await supabase.from('posts').update({ like_count: post.like_count - 1 }).eq('id', id)
      setPost(p => ({ ...p, like_count: p.like_count - 1 }))
    } else {
      await supabase.from('post_likes').insert({ user_id: user.id, post_id: Number(id) })
      await supabase.from('posts').update({ like_count: post.like_count + 1 }).eq('id', id)
      setPost(p => ({ ...p, like_count: p.like_count + 1 }))
    }
    setLiked(!liked)
  }

  const handleBookmark = async () => {
    if (!user) { navigate('/login'); return }
    if (bookmarked) {
      await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('post_id', id)
      await supabase.from('posts').update({ bookmark_count: post.bookmark_count - 1 }).eq('id', id)
      setPost(p => ({ ...p, bookmark_count: p.bookmark_count - 1 }))
    } else {
      await supabase.from('bookmarks').insert({ user_id: user.id, post_id: Number(id) })
      await supabase.from('posts').update({ bookmark_count: post.bookmark_count + 1 }).eq('id', id)
      setPost(p => ({ ...p, bookmark_count: p.bookmark_count + 1 }))
    }
    setBookmarked(!bookmarked)
  }

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !user) return
    await supabase.from('comments').insert({
      content: commentText.trim(),
      author_id: user.id,
      post_id: Number(id),
    })
    setCommentText('')
    fetchComments()
  }

  const handleCommentLike = async (commentId) => {
    if (!user) { navigate('/login'); return }
    const isLiked = likedComments.has(commentId)
    const target = comments.find(c => c.id === commentId)
    if (isLiked) {
      await supabase.from('comment_likes').delete().eq('user_id', user.id).eq('comment_id', commentId)
      await supabase.from('comments').update({ like_count: target.like_count - 1 }).eq('id', commentId)
      setLikedComments(prev => { const s = new Set(prev); s.delete(commentId); return s })
    } else {
      await supabase.from('comment_likes').insert({ user_id: user.id, comment_id: commentId })
      await supabase.from('comments').update({ like_count: target.like_count + 1 }).eq('id', commentId)
      setLikedComments(prev => new Set([...prev, commentId]))
    }
    fetchComments()
  }

  if (loading) return <Container sx={{ py: 4 }}><Typography>불러오는 중...</Typography></Container>
  if (!post) return <Container sx={{ py: 4 }}><Typography>게시물을 찾을 수 없습니다.</Typography></Container>

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 1.5, sm: 2 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>목록으로</Button>
        {user && (
          <Button variant="contained" startIcon={<EditIcon />} size="small" onClick={() => navigate('/write')}>
            새 글 작성
          </Button>
        )}
      </Box>

      <Card>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          {/* 헤더 */}
          <Stack direction="row" spacing={0.5} mb={1.5} flexWrap="wrap">
            {post.category && <Chip label={post.category} size="small" color="primary" />}
            {post.post_type !== '일반' && <Chip label={post.post_type} size="small" variant="outlined" />}
            {post.region && <Chip label={post.region} size="small" variant="outlined" />}
          </Stack>
          <Typography variant="h5" fontWeight={700} mb={2}>{post.title}</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
              {post.profiles?.nickname?.[0]}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600}>{post.profiles?.nickname}</Typography>
              <Typography variant="caption" color="text.secondary">{formatDistanceToNow(post.created_at)}</Typography>
            </Box>
          </Box>

          {post.image_url && (
            <Box component="img" src={post.image_url} alt="" sx={{ width: '100%', borderRadius: 2, mb: 2, maxHeight: 400, objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none' }} />
          )}

          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, mb: 3 }}>{post.content}</Typography>

          <Divider sx={{ mb: 2 }} />

          {/* 액션 버튼 */}
          <Stack direction="row" spacing={2}>
            <Button
              startIcon={liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
              onClick={handleLike}
              variant={liked ? 'contained' : 'outlined'}
              color={liked ? 'error' : 'inherit'}
              size="small"
            >
              좋아요 {post.like_count}
            </Button>
            <Button
              startIcon={bookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
              onClick={handleBookmark}
              variant={bookmarked ? 'contained' : 'outlined'}
              color={bookmarked ? 'primary' : 'inherit'}
              size="small"
            >
              북마크 {post.bookmark_count}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* 댓글 */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>댓글 {comments.length}</Typography>

        {user ? (
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: 13 }}>
              {profile?.nickname?.[0]}
            </Avatar>
            <TextField
              fullWidth size="small" multiline maxRows={4}
              placeholder="댓글을 입력해 주세요..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleCommentSubmit() } }}
            />
            <IconButton color="primary" onClick={handleCommentSubmit} disabled={!commentText.trim()}>
              <SendIcon />
            </IconButton>
          </Box>
        ) : (
          <Alert severity="info" sx={{ mb: 2 }}>
            댓글을 작성하려면 <Button size="small" onClick={() => navigate('/login')}>로그인</Button>이 필요합니다.
          </Alert>
        )}

        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onLike={handleCommentLike}
            isLiked={likedComments.has(comment.id)}
          />
        ))}
      </Box>
    </Container>
  )
}

export default PostDetailPage
