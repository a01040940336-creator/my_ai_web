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
import Skeleton from '@mui/material/Skeleton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ShareIcon from '@mui/icons-material/Share'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'
import { formatDate, getDdayLabel, getStatusLabel, getType, getTheme, getProgressPercent } from '../utils/date'

const RATINGS = ['아주좋음', '좋음', '보통', '나쁨', '아주나쁨']
const RATING_EMOJI = { 아주좋음: '😍', 좋음: '😊', 보통: '😐', 나쁨: '😕', 아주나쁨: '😞' }

const STATUS_COLOR = { 'CLOSING SOON': '#FF3B30', 'NOW OPEN': '#111', 'UPCOMING': '#888', 'ENDED': '#CCC' }

const PostDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [post, setPost]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [saved, setSaved]         = useState(false)
  const [reviews, setReviews]     = useState([])
  const [showReview, setShowReview] = useState(false)
  const [rating, setRating]       = useState('')
  const [content, setContent]     = useState('')
  const [currentImg, setCurrentImg] = useState(0)
  const [imgErrors, setImgErrors]   = useState({})

  useEffect(() => {
    setLoading(true)
    setPost(null)
    fetchPost()
    fetchReviews()
    if (user) fetchUserActions()
  }, [id, user])

  const fetchPost = async () => {
    const { data, error } = await supabase.from('popspot_posts').select('*').eq('id', id).single()
    if (!error && data) setPost(data)
    setLoading(false)
  }

  const fetchReviews = async () => {
    const { data } = await supabase.from('popspot_reviews').select('*').eq('post_id', id).order('created_at', { ascending: false })
    setReviews(data ?? [])
  }

  const fetchUserActions = async () => {
    const { data } = await supabase.from('popspot_saves').select('id').eq('post_id', id).eq('user_id', user.id)
    setSaved((data?.length ?? 0) > 0)
  }

  const toggleSave = async () => {
    if (!user) return navigate('/auth')
    if (saved) {
      await supabase.from('popspot_saves').delete().eq('post_id', id).eq('user_id', user.id)
    } else {
      await supabase.from('popspot_saves').insert({ post_id: id, user_id: user.id })
    }
    setSaved(v => !v)
  }

  const submitReview = async () => {
    if (!rating || !user) return
    await supabase.from('popspot_reviews').insert({ post_id: id, user_id: user.id, rating, content })
    setShowReview(false); setRating(''); setContent('')
    fetchReviews()
  }

  const handleShare = () => {
    navigator.share?.({ title: post?.title ?? 'POP SPOT', url: window.location.href }).catch(() => {})
  }

  // ── 로딩 스켈레톤 ──
  if (loading) return (
    <Box>
      <AppBar position="sticky">
        <Toolbar sx={{ minHeight: 52, px: 2 }}>
          <IconButton edge="start" onClick={() => navigate(-1)} sx={{ color: '#111' }}><ArrowBackIcon /></IconButton>
        </Toolbar>
      </AppBar>
      <Skeleton variant="rectangular" sx={{ width: '100%', aspectRatio: '4/5' }} animation="wave" />
      <Box sx={{ px: 2.5, pt: 2.5 }}>
        <Skeleton variant="text" width="30%" height={36} animation="wave" />
        <Skeleton variant="text" width="80%" height={28} animation="wave" />
        <Skeleton variant="text" width="60%" height={20} animation="wave" />
      </Box>
    </Box>
  )

  // ── 에러 (post 없음) ──
  if (!post) return (
    <Box sx={{ pt: 10, textAlign: 'center', px: 3 }}>
      <AppBar position="sticky">
        <Toolbar sx={{ minHeight: 52, px: 2 }}>
          <IconButton edge="start" onClick={() => navigate(-1)} sx={{ color: '#111' }}><ArrowBackIcon /></IconButton>
        </Toolbar>
      </AppBar>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 8 }}>게시물을 찾을 수 없어요.</Typography>
      <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>홈으로 돌아가기</Button>
    </Box>
  )

  const status   = getStatusLabel(post.start_date, post.end_date)
  const ddayLabel = getDdayLabel(post.end_date)
  const type     = getType(post.category)
  const theme    = getTheme(post.category)
  const progress = getProgressPercent(post.start_date, post.end_date)
  const isClosing = status === 'CLOSING SOON'
  const accentColor = STATUS_COLOR[status] ?? '#111'
  const images = (post.images ?? []).filter(Boolean).slice(0, 3)

  return (
    <Box sx={{ pb: 14 }}>
      {/* 상단바 */}
      <AppBar position="sticky">
        <Toolbar sx={{ minHeight: 52, px: 2 }}>
          <IconButton edge="start" onClick={() => navigate(-1)} sx={{ mr: 1, color: '#111' }}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={handleShare} sx={{ color: '#111' }}><ShareIcon /></IconButton>
        </Toolbar>
      </AppBar>

      {/* ── 이미지 캐러셀 ── */}
      {images.length > 0 && (
        <Box sx={{ position: 'relative', bgcolor: '#111' }}>
          {!imgErrors[currentImg] ? (
            <Box
              component="img"
              src={images[currentImg]}
              alt={post.title}
              loading="lazy"
              onError={() => setImgErrors(prev => ({ ...prev, [currentImg]: true }))}
              sx={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block', opacity: 0.95 }}
            />
          ) : (
            <Box sx={{ width: '100%', aspectRatio: '4/5', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#1A1A1A' }}>
              <Typography sx={{ color: '#555', fontSize: '0.75rem' }}>이미지를 불러올 수 없어요</Typography>
            </Box>
          )}

          {images.length > 1 && (
            <Box sx={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 0.75 }}>
              {images.map((_, i) => (
                <Box key={i} onClick={() => setCurrentImg(i)} sx={{
                  width: i === currentImg ? 18 : 6, height: 6, borderRadius: 3,
                  bgcolor: i === currentImg ? '#fff' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }} />
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* ── DECISION HEADER ── */}
      <Box sx={{ px: 2.5, pt: 2.5 }}>
        {/* D-day + 뱃지 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25, flexWrap: 'wrap' }}>
          <Box sx={{
            px: 1.25, py: 0.375, borderRadius: 1,
            bgcolor: isClosing ? '#FF3B30' : '#111', color: '#fff',
            fontSize: '1.125rem', fontWeight: 900, letterSpacing: '-0.02em',
          }}>
            {ddayLabel}
          </Box>
          {[type, theme].filter(Boolean).map(tag => (
            <Box key={tag} sx={{
              px: 0.875, py: 0.25, borderRadius: 0.75, border: '1px solid #EAEAEA',
              fontSize: '0.625rem', fontWeight: 700, color: '#666', lineHeight: 1.6,
            }}>{tag}</Box>
          ))}
        </Box>

        {/* 제목 */}
        <Typography sx={{ fontWeight: 800, lineHeight: 1.25, mb: 2, fontSize: '1.375rem', color: '#111' }}>
          {post.title}
        </Typography>

        {/* 기간 + 진행 바 */}
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.625 }}>
            <Typography sx={{ fontWeight: 600, color: '#555', fontSize: '0.8125rem' }}>
              {formatDate(post.start_date)}
            </Typography>
            <Typography sx={{ fontWeight: 600, color: isClosing ? '#FF3B30' : '#555', fontSize: '0.8125rem' }}>
              {formatDate(post.end_date)}
            </Typography>
          </Box>
          <Box sx={{ height: 4, borderRadius: 2, bgcolor: '#EAEAEA', overflow: 'hidden' }}>
            <Box sx={{
              height: '100%', width: `${progress}%`,
              bgcolor: isClosing ? '#FF3B30' : '#111', borderRadius: 2, transition: 'width 0.6s ease',
            }} />
          </Box>
          <Typography sx={{ color: accentColor, fontWeight: 700, fontSize: '0.75rem', mt: 0.5 }}>{status}</Typography>
        </Box>

        {/* 위치 */}
        {post.address && (
          <Box sx={{ display: 'flex', gap: 1, mb: 2.5, p: 1.5, bgcolor: '#F7F7F7', borderRadius: 2 }}>
            <LocationOnOutlinedIcon sx={{ fontSize: 16, color: '#888', mt: 0.25, flexShrink: 0 }} />
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#111', fontSize: '0.875rem' }}>{post.region}</Typography>
              <Typography variant="caption" sx={{ color: '#888' }}>{post.address}</Typography>
            </Box>
          </Box>
        )}

        {/* 설명 */}
        {post.description && (
          <Typography sx={{ color: '#444', lineHeight: 1.8, fontSize: '0.9375rem', mb: 2.5 }}>
            {post.description}
          </Typography>
        )}

        <Divider sx={{ mb: 2.5 }} />

        {/* REVIEWS */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.12em', color: '#111', mb: 1.5 }}>
            REVIEWS
            <Typography component="span" sx={{ color: '#CCC', fontSize: '0.6875rem', fontWeight: 400, ml: 0.75 }}>
              ({reviews.length})
            </Typography>
          </Typography>

          {reviews.length === 0 ? (
            <Typography variant="caption" color="text.secondary">첫 번째 리뷰를 남겨보세요!</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {reviews.map(r => (
                <Box key={r.id} sx={{ p: 1.5, bgcolor: '#F7F7F7', borderRadius: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.375 }}>
                    <Typography sx={{ fontSize: '1rem' }}>{RATING_EMOJI[r.rating] ?? '⭐'}</Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>{r.rating}</Typography>
                  </Box>
                  {r.content && <Typography sx={{ color: '#666', fontSize: '0.8125rem', lineHeight: 1.6 }}>{r.content}</Typography>}
                </Box>
              ))}
            </Box>
          )}

          {showReview && user && (
            <Box sx={{ mt: 1.5, p: 2, border: '1px solid #EAEAEA', borderRadius: 2 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.8125rem', mb: 1 }}>평가 선택</Typography>
              <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 1.5 }}>
                {RATINGS.map(r => (
                  <Chip key={r} label={`${RATING_EMOJI[r]} ${r}`} size="small" onClick={() => setRating(r)}
                    variant={rating === r ? 'filled' : 'outlined'}
                    sx={{ bgcolor: rating === r ? '#111' : 'transparent', color: rating === r ? '#fff' : '#666', borderColor: '#EAEAEA' }}
                  />
                ))}
              </Box>
              <TextField fullWidth multiline rows={2} size="small"
                placeholder="후기를 남겨주세요 (선택)"
                value={content} onChange={e => setContent(e.target.value)} sx={{ mb: 1.5 }} />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button fullWidth variant="outlined" size="small" onClick={() => setShowReview(false)}>취소</Button>
                <Button fullWidth variant="contained" size="small" onClick={submitReview} disabled={!rating}>등록</Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* ── 하단 액션바 ── */}
      <Box sx={{
        position: 'fixed', bottom: 60, left: 0, right: 0,
        bgcolor: '#fff', borderTop: '1px solid #EAEAEA',
        px: 2.5, py: 1.25,
        display: 'flex', alignItems: 'center', gap: 1,
      }}>
        {/* 저장 */}
        <IconButton onClick={toggleSave} sx={{ p: 0.875 }}>
          {saved
            ? <BookmarkIcon sx={{ color: '#111', fontSize: 24 }} />
            : <BookmarkBorderIcon sx={{ color: '#888', fontSize: 24 }} />}
        </IconButton>

        {/* 리뷰 */}
        <IconButton onClick={() => user ? setShowReview(v => !v) : navigate('/auth')} sx={{ p: 0.875 }}>
          <RateReviewOutlinedIcon sx={{ color: '#888', fontSize: 24 }} />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        {/* 지도 CTA */}
        <Button
          variant="contained" size="medium"
          onClick={() => {
            if (post.latitude && post.longitude) {
              window.open(`https://maps.google.com/?q=${post.latitude},${post.longitude}`)
            }
          }}
          disabled={!post.latitude || !post.longitude}
          sx={{ px: 2.5, py: 1, fontSize: '0.875rem', fontWeight: 700 }}
        >
          지도 보기
        </Button>
      </Box>
    </Box>
  )
}

export default PostDetailPage
