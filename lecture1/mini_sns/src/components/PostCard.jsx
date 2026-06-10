import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import { useNavigate } from 'react-router-dom'
import { differenceInDays, getDdayLabel, formatDateShort, getStatusLabel, getType, getTheme } from '../utils/date'

const STATUS_STYLE = {
  'CLOSING SOON': { bg: '#FF3B30', color: '#FFF' },
  'NOW OPEN':     { bg: '#111',    color: '#FFF' },
  'UPCOMING':     { bg: '#F0F0F0', color: '#666' },
  'ENDED':        { bg: '#EAEAEA', color: '#999' },
}

const PostCard = ({ post, isSaved = false, onToggleSave }) => {
  const navigate = useNavigate()
  const daysLeft = differenceInDays(post.end_date)
  const status = getStatusLabel(post.start_date, post.end_date)
  const type = getType(post.category)
  const ddayLabel = getDdayLabel(post.end_date)
  const isEnded = status === 'ENDED'
  const isClosing = status === 'CLOSING SOON'

  const handleBookmark = (e) => {
    e.stopPropagation()
    onToggleSave?.(post.id, e)
  }

  const { bg: statusBg, color: statusColor } = STATUS_STYLE[status] ?? STATUS_STYLE['NOW OPEN']

  return (
    <Box
      onClick={() => navigate(`/post/${post.id}`)}
      sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 0.75 }}
    >
      {/* 이미지 */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '120%',
          borderRadius: 1.5,
          overflow: 'hidden',
          bgcolor: '#F0F0F0',
          opacity: isEnded ? 0.55 : 1,
        }}
      >
        {post.images?.[0] ? (
          <Box
            component="img"
            src={post.images[0]}
            alt={post.title}
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="caption" color="text.secondary">NO IMAGE</Typography>
          </Box>
        )}

        {/* D-day 뱃지 */}
        <Box sx={{
          position: 'absolute', top: 7, left: 7,
          bgcolor: isClosing ? '#FF3B30' : 'rgba(0,0,0,0.52)',
          color: '#fff', borderRadius: 0.75,
          px: 0.75, py: 0.25,
          fontSize: '0.625rem', fontWeight: 800, lineHeight: 1.5,
        }}>
          {ddayLabel}
        </Box>

        {/* 북마크 버튼 */}
        <Box sx={{ position: 'absolute', top: 4, right: 4 }} onClick={handleBookmark}>
          <IconButton size="small" sx={{
            bgcolor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)',
            width: 28, height: 28, '&:hover': { bgcolor: '#fff' },
          }}>
            {isSaved
              ? <BookmarkIcon sx={{ fontSize: 15, color: '#111' }} />
              : <BookmarkBorderIcon sx={{ fontSize: 15, color: '#555' }} />
            }
          </IconButton>
        </Box>

        {/* TYPE 뱃지 */}
        <Box sx={{
          position: 'absolute', bottom: 7, left: 7,
          bgcolor: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(4px)',
          borderRadius: 0.5, px: 0.75, py: 0.125,
          fontSize: '0.5625rem', fontWeight: 700, color: '#333', lineHeight: 1.6,
        }}>
          {type}
        </Box>
      </Box>

      {/* 텍스트 */}
      <Box sx={{ px: 0.25 }}>
        <Typography variant="caption" sx={{ color: '#999', fontSize: '0.625rem', letterSpacing: '0.04em' }}>
          {post.region}
        </Typography>

        <Typography variant="body2" sx={{
          fontWeight: 700, color: isEnded ? '#AAA' : '#111',
          mt: 0.2, lineHeight: 1.35, fontSize: '0.8125rem',
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {post.title}
        </Typography>

        <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.625, flexWrap: 'wrap' }}>
          <Typography sx={{ fontSize: '0.625rem', color: '#BBB', lineHeight: 1 }}>
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

export default PostCard
