import { useState } from 'react'
import {
  Avatar, Box, Button, Card, CardContent,
  TextField, Tooltip, Typography,
} from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { ME } from '../data/initialPosts'

const EMOJI_OPTIONS = ['✨', '☕', '🌸', '🌊', '🎵', '🍪', '🌙', '🌺', '🎀', '🍰', '🐱', '🌷', '🎉', '📚', '🏃']

export default function NewPostForm({ onPost }) {
  const [content, setContent] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState('✨')

  const handlePost = () => {
    if (!content.trim()) return
    onPost(content.trim(), selectedEmoji)
    setContent('')
    setSelectedEmoji('✨')
  }

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 4,
        background: 'linear-gradient(135deg, #fff0f6 0%, #f8f0ff 100%)',
        border: '1.5px solid',
        borderColor: 'primary.light',
        boxShadow: '0 2px 16px rgba(244,143,177,0.12)',
      }}
    >
      <CardContent>
        <Typography variant="subtitle2" fontWeight={700} color="primary.dark" mb={1.5}>
          🌷 오늘의 일상을 공유해보세요
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
          <Avatar sx={{ background: 'linear-gradient(135deg, #f48fb1, #ce93d8)', fontSize: 20, flexShrink: 0 }}>
            {ME.avatar}
          </Avatar>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="오늘 하루 어떠셨나요? 소소한 일상을 나눠요 🌸"
            value={content}
            onChange={e => setContent(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'white',
                borderRadius: 3,
                fontSize: 14,
              },
            }}
          />
        </Box>

        {/* 이모지 선택 */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
            오늘의 감정 이모지를 골라보세요
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {EMOJI_OPTIONS.map(emoji => (
              <Tooltip key={emoji} title={emoji}>
                <Box
                  onClick={() => setSelectedEmoji(emoji)}
                  sx={{
                    cursor: 'pointer',
                    fontSize: 22,
                    p: 0.5,
                    borderRadius: 2,
                    border: '2px solid',
                    borderColor: selectedEmoji === emoji ? 'primary.main' : 'transparent',
                    bgcolor: selectedEmoji === emoji ? '#fce4ec' : 'transparent',
                    transition: 'all 0.15s',
                    '&:hover': { bgcolor: '#fce4ec', transform: 'scale(1.15)' },
                  }}
                >
                  {emoji}
                </Box>
              </Tooltip>
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            선택된 이모지: {selectedEmoji}
          </Typography>
          <Button
            variant="contained"
            onClick={handlePost}
            disabled={!content.trim()}
            startIcon={<AutoAwesomeIcon />}
            sx={{ borderRadius: 3, px: 3 }}
          >
            일상 올리기
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
