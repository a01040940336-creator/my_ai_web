import { useState } from 'react'
import { Box, Button, Chip, Collapse, Typography } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import EditIcon from '@mui/icons-material/Edit'
import CalendarView from '../components/CalendarView'
import PostCard from '../components/PostCard'
import NewPostForm from '../components/NewPostForm'
import { initialPosts, ME } from '../data/initialPosts'

function todayStr() {
  const t = new Date()
  const pad = n => String(n).padStart(2, '0')
  return `${t.getFullYear()}-${pad(t.getMonth()+1)}-${pad(t.getDate())}`
}

export default function Feed() {
  const [posts, setPosts] = useState(initialPosts)
  const [selectedDate, setSelectedDate] = useState(todayStr())
  const [showForm, setShowForm] = useState(false)

  const handlePost = (content, emoji) => {
    const newPost = {
      id: Date.now(),
      author: ME,
      date: todayStr(),
      timeAgo: '방금 전',
      content,
      emoji,
      likes: 0,
      liked: false,
      comments: [],
    }
    setPosts(prev => [newPost, ...prev])
    setSelectedDate(todayStr())
    setShowForm(false)
  }

  const handleLike = (id) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
      )
    )
  }

  const handleComment = (postId, text) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, comments: [...p.comments, { id: Date.now(), author: ME, content: text, timeAgo: '방금 전' }] }
          : p
      )
    )
  }

  const dayPosts = selectedDate
    ? posts.filter(p => p.date === selectedDate)
    : []

  const formatDate = (dateStr) => {
    const [y, m, d] = dateStr.split('-')
    const dayNames = ['일', '월', '화', '수', '목', '금', '토']
    const dow = new Date(dateStr).getDay()
    return `${y}년 ${Number(m)}월 ${Number(d)}일 (${dayNames[dow]})`
  }

  return (
    <Box>
      {/* 캘린더 */}
      <CalendarView
        posts={posts}
        selectedDate={selectedDate}
        onDayClick={setSelectedDate}
      />

      {/* 선택한 날짜 헤더 */}
      {selectedDate && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" fontWeight={800} color="primary.dark">
              {formatDate(selectedDate)}
            </Typography>
            {dayPosts.length > 0 && (
              <Chip
                label={`${dayPosts.length}개`}
                size="small"
                sx={{ bgcolor: '#fce4ec', color: 'primary.dark', fontWeight: 700 }}
              />
            )}
          </Box>

          {/* 글쓰기 버튼 */}
          <Button
            size="small"
            variant={showForm ? 'outlined' : 'contained'}
            startIcon={showForm ? <KeyboardArrowUpIcon /> : <EditIcon />}
            onClick={() => setShowForm(v => !v)}
            sx={{ borderRadius: 3 }}
          >
            {showForm ? '닫기' : '일상 올리기'}
          </Button>
        </Box>
      )}

      {/* 글쓰기 폼 */}
      <Collapse in={showForm}>
        <NewPostForm onPost={handlePost} />
      </Collapse>

      {/* 해당 날짜 게시물 */}
      {dayPosts.length > 0 ? (
        dayPosts.map(post => (
          <PostCard key={post.id} post={post} onLike={handleLike} onComment={handleComment} />
        ))
      ) : (
        <Box
          sx={{
            textAlign: 'center', py: 6,
            bgcolor: '#fff8fb', borderRadius: 4,
            border: '2px dashed', borderColor: 'primary.light',
          }}
        >
          <Typography sx={{ fontSize: 48, mb: 1 }}>🌷</Typography>
          <Typography color="text.secondary" variant="body2">
            이 날은 아직 일상이 없어요
          </Typography>
          <Button
            size="small"
            variant="text"
            sx={{ mt: 1, color: 'primary.main' }}
            onClick={() => setShowForm(true)}
          >
            첫 일상을 기록해보세요 ✨
          </Button>
        </Box>
      )}
    </Box>
  )
}
