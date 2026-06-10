import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ShareIcon from '@mui/icons-material/Share'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'
import { differenceInDays, formatDate } from '../utils/date'

const RATINGS = ['아주좋음', '좋음', '보통', '나쁨', '아주나쁨']
const RATING_EMOJI = { 아주좋음: '😍', 좋음: '😊', 보통: '😐', 나쁨: '😕', 아주나쁨: '😞' }

const PostDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [post, setPost] = useState(null)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [reviews, setReviews] = useState([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState('')
  const [reviewContent, setReviewContent] = useState('')
  const [currentImg, setCurrentImg] = useState(0)

  useEffect(() => {
    fetchPost()
    fetchReviews()
    if (user) {
      fetchUserActions()
    }
  }, [id, user])

  const fetchPost = async () => {
    const { data } = await supabase.from('popspot_posts').select('*').eq('id', id).single()
    setPost(data)
  }

  const fetchReviews = async () => {
    const { data } = await supabase
      .from('popspot_reviews')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: false })
    setReviews(data || [])
  }

  const fetchUserActions = async () => {
    const { data: likeData } = await supabase
      .from('popspot_likes')
      .select('id')
      .eq('post_id', id)
      .eq('user_id', user.id)
    setLiked(likeData?.length > 0)

    const { data: likeCount } = await supabase
      .from('popspot_likes')
      .select('id', { count: 'exact' })
      .eq('post_id', id)
    setLikeCount(likeCount?.length || 0)

    const { data: saveData } = await supabase
      .from('popspot_saves')
      .select('id')
      .eq('post_id', id)
      .eq('user_id', user.id)
    setSaved(saveData?.length > 0)
  }

  const toggleLike = async () => {
    if (!user) return navigate('/auth')
    if (liked) {
      await supabase.from('popspot_likes').delete().eq('post_id', id).eq('user_id', user.id)
      setLiked(false)
      setLikeCount(c => c - 1)
    } else {
      await supabase.from('popspot_likes').insert({ post_id: id, user_id: user.id })
      setLiked(true)
      setLikeCount(c => c + 1)
    }
  }

  const toggleSave = async () => {
    if (!user) return navigate('/auth')
    if (saved) {
      await supabase.from('popspot_saves').delete().eq('post_id', id).eq('user_id', user.id)
      setSaved(false)
    } else {
      await supabase.from('popspot_saves').insert({ post_id: id, user_id: user.id })
      setSaved(true)
    }
  }

  const submitReview = async () => {
    if (!rating) return
    await supabase.from('popspot_reviews').insert({
      post_id: id,
      user_id: user.id,
      rating,
      content: reviewContent,
    })
    setShowReviewForm(false)
    setRating('')
    setReviewContent('')
    fetchReviews()
  }

  if (!post) return null

  const daysLeft = differenceInDays(post.end_date)
  const isClosing = daysLeft >= 0 && daysLeft <= 3
  const ddayLabel = daysLeft < 0 ? '종료' : daysLeft === 0 ? 'TODAY' : `D-${daysLeft}`

  return (
    <Box sx={{ pb: 12 }}>
      {/* 상단바 */}
      <AppBar position="sticky">
        <Toolbar sx={{ minHeight: 52, px: 2 }}>
          <IconButton edge="start" onClick={() => navigate(-1)} sx={{ mr: 1, color: '#111' }}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton sx={{ color: '#111' }}>
            <ShareIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* 대표 이미지 */}
      {post.images?.length > 0 && (
        <Box sx={{ position: 'relative' }}>
          <Box
            component="img"
            src={post.images[currentImg]}
            alt={post.title}
            sx={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block' }}
          />
          {post.images.length > 1 && (
            <Box sx={{ position: 'absolute', bottom: 12, right: 12, display: 'flex', gap: 0.5 }}>
              {post.images.map((_, i) => (
                <Box
                  key={i}
                  onClick={() => setCurrentImg(i)}
                  sx={{
                    width: 6, height: 6, borderRadius: '50%',
                    bgcolor: currentImg === i ? '#fff' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* EDITORIAL INTRO */}
      <Box sx={{ px: 2.5, pt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="caption" sx={{ color: '#999', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {post.region} · {post.category}
          </Typography>
          {isClosing && (
            <Chip
              label={ddayLabel}
              size="small"
              sx={{ bgcolor: '#FF3B30', color: '#fff', fontWeight: 700, fontSize: '0.6875rem', height: 20 }}
            />
          )}
        </Box>
        <Typography variant="h2" sx={{ fontWeight: 800, lineHeight: 1.3, mb: 1.5 }}>
          {post.title}
        </Typography>
        <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.8 }}>
          {post.description}
        </Typography>
      </Box>

      <Divider sx={{ mx: 2.5, my: 2.5 }} />

      {/* KEY INFO */}
      <Box sx={{ px: 2.5 }}>
        <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.1em' }}>KEY INFO</Typography>
        <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: '#666', mt: 0.25 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#111' }}>기간</Typography>
              <Typography variant="body2">
                {formatDate(post.start_date)} ~ {formatDate(post.end_date)}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <LocationOnOutlinedIcon sx={{ fontSize: 16, color: '#666', mt: 0.25 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#111' }}>위치</Typography>
              <Typography variant="body2">{post.address}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mx: 2.5, my: 2.5 }} />

      {/* REVIEWS */}
      <Box sx={{ px: 2.5 }}>
        <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.1em' }}>
          REVIEWS ({reviews.length})
        </Typography>

        {reviews.length === 0 ? (
          <Typography variant="body2" sx={{ mt: 1.5, color: '#999' }}>첫 번째 리뷰를 남겨보세요!</Typography>
        ) : (
          <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {reviews.map(r => (
              <Box key={r.id} sx={{ p: 1.5, bgcolor: '#F7F7F7', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                  <Typography sx={{ fontSize: '1.125rem' }}>{RATING_EMOJI[r.rating]}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.rating}</Typography>
                </Box>
                {r.content && (
                  <Typography variant="body2" color="text.secondary">{r.content}</Typography>
                )}
              </Box>
            ))}
          </Box>
        )}

        {/* 리뷰 작성 폼 */}
        {showReviewForm && user && (
          <Box sx={{ mt: 2, p: 2, border: '1px solid #EAEAEA', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>평가 선택</Typography>
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 1.5 }}>
              {RATINGS.map(r => (
                <Chip
                  key={r}
                  label={`${RATING_EMOJI[r]} ${r}`}
                  size="small"
                  onClick={() => setRating(r)}
                  variant={rating === r ? 'filled' : 'outlined'}
                  sx={{
                    bgcolor: rating === r ? '#111' : 'transparent',
                    color: rating === r ? '#fff' : '#666',
                    borderColor: '#EAEAEA',
                  }}
                />
              ))}
            </Box>
            <TextField
              fullWidth
              multiline
              rows={2}
              size="small"
              placeholder="방문 후기를 남겨주세요 (선택)"
              value={reviewContent}
              onChange={e => setReviewContent(e.target.value)}
              sx={{ mb: 1.5 }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button fullWidth variant="outlined" size="small" onClick={() => setShowReviewForm(false)}>
                취소
              </Button>
              <Button fullWidth variant="contained" size="small" onClick={submitReview} disabled={!rating}>
                등록
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {/* 하단 고정 액션 바 */}
      <Box
        sx={{
          position: 'fixed', bottom: 60, left: 0, right: 0,
          bgcolor: '#fff', borderTop: '1px solid #EAEAEA',
          px: 2.5, py: 1.5,
          display: 'flex', alignItems: 'center', gap: 1.5,
        }}
      >
        <IconButton onClick={toggleLike} sx={{ p: 0.75 }}>
          {liked ? <FavoriteIcon sx={{ color: '#FF3B30' }} /> : <FavoriteBorderIcon sx={{ color: '#666' }} />}
        </IconButton>
        <Typography variant="caption" sx={{ color: '#666', minWidth: 20 }}>{likeCount}</Typography>

        <IconButton onClick={toggleSave} sx={{ p: 0.75 }}>
          {saved ? <BookmarkIcon sx={{ color: '#111' }} /> : <BookmarkBorderIcon sx={{ color: '#666' }} />}
        </IconButton>

        <IconButton onClick={() => user ? setShowReviewForm(v => !v) : navigate('/auth')} sx={{ p: 0.75 }}>
          <RateReviewOutlinedIcon sx={{ color: '#666' }} />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          size="small"
          onClick={() => post.latitude && window.open(`https://maps.google.com/?q=${post.latitude},${post.longitude}`)}
        >
          지도 보기
        </Button>
      </Box>
    </Box>
  )
}

export default PostDetailPage
