import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { useNavigate } from 'react-router-dom'
import { differenceInDays, parseISO } from '../utils/date'

const PostCard = ({ post, compact = false }) => {
  const navigate = useNavigate()
  const daysLeft = differenceInDays(post.end_date)

  const getDdayLabel = () => {
    if (daysLeft < 0) return '종료'
    if (daysLeft === 0) return 'TODAY'
    if (daysLeft === 1) return 'D-1'
    return `D-${daysLeft}`
  }

  const isClosing = daysLeft >= 0 && daysLeft <= 3

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
          paddingTop: compact ? '125%' : '100%',
          borderRadius: 1,
          overflow: 'hidden',
          bgcolor: '#F5F5F5',
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

        {isClosing && (
          <Chip
            label={getDdayLabel()}
            size="small"
            sx={{
              position: 'absolute',
              top: 8, left: 8,
              bgcolor: '#FF3B30',
              color: '#FFF',
              fontWeight: 700,
              fontSize: '0.6875rem',
              height: 22,
            }}
          />
        )}
      </Box>

      {/* 텍스트 */}
      <Box>
        <Typography
          variant="caption"
          sx={{ color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}
        >
          {post.region} · {post.category}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: '#111',
            mt: 0.25,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {post.title}
        </Typography>
        <Typography variant="caption" sx={{ color: '#999', mt: 0.25, display: 'block' }}>
          {post.end_date} 까지
        </Typography>
      </Box>
    </Box>
  )
}

export default PostCard
