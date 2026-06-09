import React, { useState } from 'react'
import {
  Container, Card, CardContent, Typography, TextField, Button,
  MenuItem, Stack, Chip, Box, FormControlLabel, Switch, Alert
} from '@mui/material'
import ImageIcon from '@mui/icons-material/Image'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = ['자취꿀팁', '요리', '공동구매', '냉장고나눔', '동네정보', '동네모임', '질문게시판']
const POST_TYPES = ['일반', '냉장고나눔', '공동구매', '생활도움']
const REGIONS = ['서울 강남구', '서울 마포구', '서울 성동구', '서울 용산구', '서울 종로구', '부산 해운대구', '인천 연수구', '기타']

const WritePage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form, setForm] = useState({
    title: '', content: '', category: '', region: '',
    post_type: '일반', visibility: 'public', image_url: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imageLoading, setImageLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleRandomImage = async () => {
    setImageLoading(true)
    const seed = Math.random().toString(36).substring(7)
    const url = `https://picsum.photos/seed/${seed}/800/400`
    setForm(f => ({ ...f, image_url: url }))
    setImageLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.category) {
      setError('제목과 카테고리는 필수입니다.')
      return
    }
    setError('')
    setLoading(true)

    const { data, error: err } = await supabase.from('posts').insert({
      title: form.title.trim(),
      content: form.content.trim(),
      category: form.category,
      region: form.region || null,
      post_type: form.post_type,
      visibility: form.visibility,
      image_url: form.image_url || null,
      author_id: user.id,
      like_count: 0,
      bookmark_count: 0,
    }).select().single()

    if (err) { setError(err.message); setLoading(false); return }
    navigate(`/posts/${data.id}`)
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1.5, sm: 2 } }}>
      <Typography variant="h5" fontWeight={700} mb={3}>글 작성</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="카테고리" name="category" select value={form.category}
                  onChange={handleChange} required fullWidth size="small"
                >
                  {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
                <TextField
                  label="게시물 유형" name="post_type" select value={form.post_type}
                  onChange={handleChange} fullWidth size="small"
                >
                  {POST_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </TextField>
                <TextField
                  label="지역" name="region" select value={form.region}
                  onChange={handleChange} fullWidth size="small"
                >
                  <MenuItem value="">선택 안 함</MenuItem>
                  {REGIONS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                </TextField>
              </Stack>

              <TextField
                label="제목" name="title" value={form.title} onChange={handleChange}
                required fullWidth placeholder="제목을 입력해 주세요"
              />

              <TextField
                label="내용" name="content" value={form.content} onChange={handleChange}
                multiline rows={10} fullWidth placeholder="내용을 입력해 주세요..."
              />

              {/* 이미지 */}
              <Box>
                <Button
                  variant="outlined" startIcon={<ImageIcon />}
                  onClick={handleRandomImage} disabled={imageLoading}
                >
                  {imageLoading ? '이미지 로딩 중...' : '랜덤 이미지 추가'}
                </Button>
                {form.image_url && (
                  <Box sx={{ mt: 1.5, position: 'relative' }}>
                    <Box component="img" src={form.image_url} alt="preview" sx={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 2 }} />
                    <Button size="small" onClick={() => setForm(f => ({ ...f, image_url: '' }))} sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', minWidth: 'auto', px: 1 }}>
                      ✕
                    </Button>
                  </Box>
                )}
              </Box>

              <FormControlLabel
                control={<Switch checked={form.visibility === 'private'} onChange={(e) => setForm(f => ({ ...f, visibility: e.target.checked ? 'private' : 'public' }))} />}
                label="비공개 게시물"
              />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={() => navigate(-1)}>취소</Button>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? '게시 중...' : '게시하기'}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}

export default WritePage
