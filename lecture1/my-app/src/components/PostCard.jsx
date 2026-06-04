import { useState } from 'react'
import {
  Avatar, Box, Card, CardContent, Chip,
  Collapse, Divider, IconButton, InputAdornment,
  TextField, Typography,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import SendIcon from '@mui/icons-material/Send'
import { ME } from '../data/initialPosts'

const AVATAR_BG = [
  'linear-gradient(135deg, #f48fb1, #ce93d8)',
  'linear-gradient(135deg, #ce93d8, #90caf9)',
  'linear-gradient(135deg, #a5d6a7, #80deea)',
  'linear-gradient(135deg, #ffcc80, #f48fb1)',
]

function getAvatarBg(name) {
  const idx = name.charCodeAt(0) % AVATAR_BG.length
  return AVATAR_BG[idx]
}

export default function PostCard({ post, onLike, onComment }) {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')

  const handleComment = () => {
    if (!commentText.trim()) return
    onComment(post.id, commentText.trim())
    setCommentText('')
  }

  return (
    <Card sx={{ mb: 2.5, borderRadius: 4, boxShadow: '0 2px 16px rgba(244,143,177,0.12)' }}>
      <CardContent sx={{ pb: '16px !important' }}>
        {/* 작성자 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Avatar
            sx={{
              background: getAvatarBg(post.author.name),
              mr: 1.5, fontSize: 20,
              boxShadow: '0 2px 8px rgba(244,143,177,0.25)',
            }}
          >
            {post.author.avatar}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" fontWeight={700} color="text.primary">
              {post.author.name}
              {post.author.name === ME.name && (
                <Chip label="나" size="small" sx={{ ml: 0.8, height: 18, fontSize: 10, bgcolor: '#fce4ec', color: 'primary.dark' }} />
              )}
            </Typography>
            <Typography variant="caption" color="text.secondary">{post.timeAgo}</Typography>
          </Box>
          <Typography sx={{ fontSize: 22 }}>{post.emoji}</Typography>
        </Box>

        {/* 내용 */}
        <Box
          sx={{
            bgcolor: '#fff8fb',
            borderRadius: 3,
            px: 2, py: 1.5,
            mb: 1.5,
            border: '1px solid',
            borderColor: 'primary.light',
          }}
        >
          <Typography variant="body2" sx={{ lineHeight: 1.9, color: 'text.primary' }}>
            {post.content}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: '#fce4ec', mb: 1 }} />

        {/* 좋아요 / 댓글 버튼 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => onLike(post.id)}
            sx={{ color: post.liked ? 'error.main' : 'text.secondary', transition: 'transform 0.15s', '&:active': { transform: 'scale(1.3)' } }}
          >
            {post.liked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          </IconButton>
          <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
            {post.likes}
          </Typography>

          <IconButton
            size="small"
            onClick={() => setShowComments(v => !v)}
            sx={{ color: showComments ? 'primary.main' : 'text.secondary' }}
          >
            <ChatBubbleOutlineIcon fontSize="small" />
          </IconButton>
          <Typography variant="caption" color="text.secondary">
            댓글 {post.comments.length}개
          </Typography>
        </Box>

        {/* 댓글 영역 */}
        <Collapse in={showComments}>
          <Box sx={{ mt: 1.5 }}>
            {post.comments.length === 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
                아직 댓글이 없어요. 첫 댓글을 남겨보세요 🌸
              </Typography>
            )}
            {post.comments.map(c => (
              <Box key={c.id} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Avatar sx={{ width: 28, height: 28, fontSize: 13, background: getAvatarBg(c.author.name), flexShrink: 0 }}>
                  {c.author.avatar}
                </Avatar>
                <Box sx={{ bgcolor: '#f8f0ff', borderRadius: 3, px: 1.5, py: 0.8, flexGrow: 1 }}>
                  <Typography variant="caption" fontWeight={700} color="primary.dark">
                    {c.author.name}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 13 }}>{c.content}</Typography>
                  <Typography variant="caption" color="text.secondary">{c.timeAgo}</Typography>
                </Box>
              </Box>
            ))}

            {/* 댓글 입력 */}
            <Box sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center' }}>
              <Avatar sx={{ width: 28, height: 28, fontSize: 13, background: getAvatarBg(ME.name), flexShrink: 0 }}>
                {ME.avatar}
              </Avatar>
              <TextField
                fullWidth
                size="small"
                placeholder="따뜻한 댓글을 남겨보세요 💬"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleComment()}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={handleComment} color="primary" disabled={!commentText.trim()}>
                        <SendIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 3, fontSize: 13 },
                }}
              />
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  )
}
