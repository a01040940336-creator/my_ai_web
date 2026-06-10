import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Alert from '@mui/material/Alert'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = ['아이돌', '뷰티', '패션', '전시', '라이프스타일']

const PostWritePage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    region: '',
    address: '',
    start_date: '',
    end_date: '',
    images: ['', '', ''],
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!user) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ mb: 2 }}>로그인이 필요한 기능이에요.</Typography>
        <Button variant="contained" onClick={() => navigate('/auth')}>로그인하기</Button>
      </Box>
    )
  }

  const handleChange = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleImageChange = (i) => (e) => {
    const updated = [...form.images]
    updated[i] = e.target.value
    setForm(prev => ({ ...prev, images: updated }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const images = form.images.filter(Boolean)
    const { error } = await supabase.from('popspot_posts').insert({
      ...form,
      images,
      author_id: user.id,
    })

    if (error) setError('등록 중 오류가 발생했어요: ' + error.message)
    else navigate('/')

    setLoading(false)
  }

  return (
    <Box sx={{ pb: 4 }}>
      <AppBar position="sticky">
        <Toolbar sx={{ minHeight: 52, px: 2 }}>
          <IconButton edge="start" onClick={() => navigate(-1)} sx={{ mr: 1, color: '#111' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: 700 }}>게시물 등록</Typography>
          <Button
            variant="contained"
            size="small"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ fontSize: '0.8125rem' }}
          >
            저장
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="form" onSubmit={handleSubmit} sx={{ px: 2.5, pt: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField label="이름 *" value={form.title} onChange={handleChange('title')} required fullWidth size="small" />

        <TextField
          label="카테고리 *"
          select
          value={form.category}
          onChange={handleChange('category')}
          required
          fullWidth
          size="small"
        >
          {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </TextField>

        <TextField label="지역 *" value={form.region} onChange={handleChange('region')} required fullWidth size="small" placeholder="예: 성수, 홍대, 강남" />
        <TextField label="상세 주소 *" value={form.address} onChange={handleChange('address')} required fullWidth size="small" />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <TextField
            label="시작일 *"
            type="date"
            value={form.start_date}
            onChange={handleChange('start_date')}
            required
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="종료일 *"
            type="date"
            value={form.end_date}
            onChange={handleChange('end_date')}
            required
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        <TextField
          label="소개 글"
          value={form.description}
          onChange={handleChange('description')}
          fullWidth
          multiline
          rows={4}
          size="small"
          placeholder="팝업/전시에 대한 에디토리얼 소개를 작성해주세요."
        />

        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>이미지 URL (최대 3장)</Typography>
          {[0, 1, 2].map(i => (
            <TextField
              key={i}
              fullWidth
              size="small"
              value={form.images[i]}
              onChange={handleImageChange(i)}
              placeholder={`이미지 URL ${i + 1}`}
              sx={{ mb: 1 }}
            />
          ))}
        </Box>

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={loading}
          sx={{ mt: 1, py: 1.5 }}
        >
          {loading ? '등록 중...' : '팝업/전시 등록하기'}
        </Button>
      </Box>
    </Box>
  )
}

export default PostWritePage
