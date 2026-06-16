import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import { useNavigate } from 'react-router-dom'
import { getDdayLabel, formatDateShort, getStatusLabel, getType } from '../utils/date'

const FALLBACK_BG = '#F0F0F0'

const STATUS_STYLE = {
  'CLOSING SOON': { bg: '#FF3B30', color: '#FFF' },
  'NOW OPEN':     { bg: '#111',    color: '#FFF' },
  'UPCOMING':     { bg: '#EAEAEA', color: '#555' },
  'ENDED':        { bg: '#EAEAEA', color: '#AAA' },
}

// ── 공통: 북마크 버튼 ──
const BookmarkBtn = ({ isSaved, onToggleSave, postId }) => (
  <Box
    sx={{ position: 'absolute', top: 4, right: 4 }}
    onClick={e => { e.stopPropagation(); onToggleSave?.(postId, e) }}
  >
    <IconButton size="small" sx={{
      bgcolor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)',
      width: 28, height: 28, '&:hover': { bgcolor: '#fff' },
    }}>
      {isSaved
        ? <BookmarkIcon sx={{ fontSize: 15, color: '#111' }} />
        : <BookmarkBorderIcon sx={{ fontSize: 15, color: '#555' }} />}
    </IconButton>
  </Box>
)

// ── 1. EXHIBITION 에디토리얼 카드 (풀 이미지, 와이드) ──
const ExhibitionCard = ({ post, isSaved, onToggleSave, navigate }) => {
  const status = getStatusLabel(post.start_date, post.end_date)
  const dday = getDdayLabel(post.end_date)
  const isClosing = status === 'CLOSING SOON'
  const { bg: statusBg, color: statusColor } = STATUS_STYLE[status] ?? STATUS_STYLE['NOW OPEN']

  return (
    <Box
      onClick={() => navigate(`/post/${post.id}`)}
      sx={{
        gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 3' },
        cursor: 'pointer', mb: 0.5,
        borderRadius: { xs: 1.5, md: 2 }, overflow: 'hidden', position: 'relative',
        bgcolor: FALLBACK_BG,
        transition: 'transform 0.18s ease',
        '&:active': { transform: 'scale(0.985)' },
      }}
    >
      {/* 대표 이미지 */}
      <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
        {post.images?.[0] ? (
          <Box
            component="img"
            src={post.images[0]}
            alt={post.title}
            loading="lazy"
            onError={e => { e.target.style.display = 'none' }}
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#E8E8E8' }}>
            <Typography sx={{ fontSize: '0.625rem', color: '#CCC' }}>NO IMAGE</Typography>
          </Box>
        )}

        {/* 그라데이션 오버레이 */}
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 50%)' }} />

        {/* D-day */}
        <Box sx={{
          position: 'absolute', top: 10, left: 10,
          bgcolor: isClosing ? '#FF3B30' : 'rgba(0,0,0,0.55)', color: '#fff',
          borderRadius: 1, px: 1, py: 0.375, fontSize: '0.6875rem', fontWeight: 800,
        }}>
          {dday}
        </Box>

        {/* EXHIBITION 배지 */}
        <Box sx={{
          position: 'absolute', top: 10, left: dday.length * 8 + 30,
          bgcolor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.3)', color: '#fff',
          borderRadius: 0.75, px: 0.875, py: 0.25, fontSize: '0.5625rem', fontWeight: 700,
        }}>
          EXHIBITION
        </Box>

        {/* 북마크 */}
        <BookmarkBtn isSaved={isSaved} onToggleSave={onToggleSave} postId={post.id} />

        {/* 하단 텍스트 오버레이 */}
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, px: { xs: 1.75, md: 3 }, pb: { xs: 1.5, md: 2.5 } }}>
          <Typography sx={{ fontWeight: 800, color: '#fff', fontSize: { xs: '1rem', md: '1.375rem' }, lineHeight: 1.3, mb: 0.5 }}>
            {post.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: { xs: '0.6875rem', md: '0.875rem' }, color: 'rgba(255,255,255,0.75)' }}>
              {post.region} · {formatDateShort(post.start_date)} – {formatDateShort(post.end_date)}
            </Typography>
            <Box sx={{
              px: 0.75, py: 0.125, borderRadius: 0.5,
              bgcolor: statusBg, color: statusColor,
              fontSize: '0.5rem', fontWeight: 700, lineHeight: 1.6,
            }}>
              {status}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

// ── 2. POP-UP 카드형 (2열 그리드) ──
const PopupCard = ({ post, isSaved, onToggleSave, navigate }) => {
  const status = getStatusLabel(post.start_date, post.end_date)
  const dday = getDdayLabel(post.end_date)
  const isClosing = status === 'CLOSING SOON'
  const isEnded = status === 'ENDED'
  const { bg: statusBg, color: statusColor } = STATUS_STYLE[status] ?? STATUS_STYLE['NOW OPEN']

  return (
    <Box
      onClick={() => navigate(`/post/${post.id}`)}
      sx={{
        cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 0.75,
        opacity: isEnded ? 0.55 : 1,
        transition: 'transform 0.15s ease',
        '&:active': { transform: 'scale(0.97)' },
      }}
    >
      {/* 이미지 */}
      <Box sx={{ position: 'relative', width: '100%', paddingTop: '120%', borderRadius: 1.5, overflow: 'hidden', bgcolor: FALLBACK_BG }}>
        {post.images?.[0] ? (
          <Box
            component="img" src={post.images[0]} alt={post.title} loading="lazy"
            onError={e => { e.target.style.display = 'none' }}
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#E8E8E8' }}>
            <Typography sx={{ fontSize: '0.5625rem', color: '#CCC' }}>NO IMAGE</Typography>
          </Box>
        )}

        {/* D-day */}
        <Box sx={{
          position: 'absolute', top: 7, left: 7,
          bgcolor: isClosing ? '#FF3B30' : 'rgba(0,0,0,0.52)', color: '#fff',
          borderRadius: 0.75, px: 0.75, py: 0.25, fontSize: '0.625rem', fontWeight: 800,
        }}>
          {dday}
        </Box>

        {/* 북마크 */}
        <BookmarkBtn isSaved={isSaved} onToggleSave={onToggleSave} postId={post.id} />

        {/* TYPE */}
        <Box sx={{
          position: 'absolute', bottom: 6, left: 6,
          bgcolor: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(4px)',
          borderRadius: 0.5, px: 0.75, py: 0.125,
          fontSize: '0.5rem', fontWeight: 700, color: '#333', lineHeight: 1.6,
        }}>
          POP-UP
        </Box>
      </Box>

      {/* 텍스트 */}
      <Box sx={{ px: 0.25 }}>
        <Typography sx={{ fontSize: '0.625rem', color: '#BBB', letterSpacing: '0.03em' }}>{post.region}</Typography>
        <Typography sx={{
          fontWeight: 700, color: isEnded ? '#AAA' : '#111', mt: 0.2,
          lineHeight: 1.35, fontSize: '0.8125rem',
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {post.title}
        </Typography>
        <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.625, flexWrap: 'wrap' }}>
          <Typography sx={{ fontSize: '0.625rem', color: '#CCC', lineHeight: 1 }}>
            {formatDateShort(post.start_date)} – {formatDateShort(post.end_date)}
          </Typography>
          <Box sx={{
            px: 0.625, py: 0.125, borderRadius: 0.5,
            bgcolor: statusBg, color: statusColor,
            fontSize: '0.5rem', fontWeight: 700, lineHeight: 1.6, flexShrink: 0,
          }}>
            {status}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

// ── 메인 export ──
const PostCard = ({ post, isSaved = false, onToggleSave }) => {
  const navigate = useNavigate()
  if (!post) return null
  const type = getType(post.category)

  if (type === 'EXHIBITION') {
    return <ExhibitionCard post={post} isSaved={isSaved} onToggleSave={onToggleSave} navigate={navigate} />
  }
  return <PopupCard post={post} isSaved={isSaved} onToggleSave={onToggleSave} navigate={navigate} />
}

export default PostCard
