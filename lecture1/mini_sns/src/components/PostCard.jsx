import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import { useNavigate } from 'react-router-dom'
import { differenceInDays, getDdayLabel, formatDateShort, getStatus } from '../utils/date'

const STATUS_COLOR = { 예정: '#888', 진행중: '#111', 종료: '#CCC' }
const STATUS_BG = { 예정: '#F0F0F0', 진행중: '#111', 종료: '#EAEAEA' }
const STATUS_TEXT = { 예정: '#555', 진행중: '#FFF', 종료: '#999' }

const PostCard = ({ post, compact = false, isSaved = false, onToggleSave }) => {
  const navigate = useNavigate()
  const daysLeft = differenceInDays(post.end_date)
  const isClosing = daysLeft >= 0 && daysLeft <= 3
  const isEnded = daysLeft < 0
  const status = getStatus(post.start_date, post.end_date)
  const ddayLabel = getDdayLabel(post.end_date)

  const handleBookmark = (e) => {
    e.stopPropagation()
    onToggleSave?.(post.id, e)
  }

  return (
    <Box
      onClick={() => navigate(`/post/${post.id}`)}
      sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 0.75 }}
    >
      {/* 이미지 영역 */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: compact ? '120%' : '100%',
          borderRadius: 1.5,
          overflow: 'hidden',
          bgcolor: '#F5F5F5',
          opacity: isEnded ? 0.6 : 1,
        }}
      >
        {post.images?.[0] ? (
          <Box
            component="img"
            src={post.images[0]}
            alt={post.title}
            sx={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Typography variant="caption" color="text.secondary">이미지 없음</Typography>
          </Box>
        )}

        {/* D-day 뱃지 - 좌상단 */}
        <Box
          sx={{
            position: 'absolute',
            top: 7, left: 7,
            bgcolor: isClosing ? '#FF3B30' : isEnded ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.55)',
            color: '#fff',
            borderRadius: 0.75,
            px: 0.75,
            py: 0.25,
            fontSize: '0.625rem',
            fontWeight: 700,
            lineHeight: 1.5,
            letterSpacing: '0.02em',
          }}
        >
          {ddayLabel}
        </Box>

        {/* 북마크 버튼 - 우상단 */}
        <Box
          sx={{
            position: 'absolute',
            top: 3, right: 3,
          }}
          onClick={handleBookmark}
        >
          <IconButton
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(4px)',
              width: 28, height: 28,
              '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
            }}
          >
            {isSaved
              ? <BookmarkIcon sx={{ fontSize: 15, color: '#111' }} />
              : <BookmarkBorderIcon sx={{ fontSize: 15, color: '#555' }} />
            }
          </IconButton>
        </Box>
      </Box>

      {/* 텍스트 영역 */}
      <Box sx={{ px: 0.25 }}>
        {/* 지역 · 카테고리 */}
        <Typography
          variant="caption"
          sx={{ color: '#999', letterSpacing: '0.03em', display: 'block', lineHeight: 1.4 }}
        >
          {post.region} · {post.category}
        </Typography>

        {/* 제목 */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: isEnded ? '#AAA' : '#111',
            mt: 0.25,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.4,
            fontSize: '0.8125rem',
          }}
        >
          {post.title}
        </Typography>

        {/* 기간 + 상태 */}
        <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
          <Typography
            variant="caption"
            sx={{ color: '#AAA', fontSize: '0.6875rem', lineHeight: 1 }}
          >
            {formatDateShort(post.start_date)} ~ {formatDateShort(post.end_date)}
          </Typography>
          <Box
            sx={{
              px: 0.75,
              py: 0.125,
              borderRadius: 0.5,
              bgcolor: STATUS_BG[status],
              fontSize: '0.5625rem',
              fontWeight: 700,
              color: STATUS_TEXT[status],
              lineHeight: 1.6,
              flexShrink: 0,
            }}
          >
            {status}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default PostCard
