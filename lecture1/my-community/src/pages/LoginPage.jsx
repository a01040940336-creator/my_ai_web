import React, { useState } from 'react'
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Divider, Alert, Link, Stack
} from '@mui/material'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { supabase } from '../supabase'

const LoginPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    if (error) setError(error.message)
    else navigate('/')
    setLoading(false)
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" color="primary" fontWeight={800}>집담</Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              1인 가구 지역 커뮤니티
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="이메일"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                fullWidth
                size="small"
              />
              <TextField
                label="비밀번호"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                fullWidth
                size="small"
              />
              <Button type="submit" variant="contained" fullWidth disabled={loading} size="large">
                {loading ? '로그인 중...' : '로그인'}
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary">간편 로그인</Typography>
          </Divider>

          <Stack spacing={1.5}>
            <Button
              fullWidth variant="outlined"
              sx={{ bgcolor: '#FEE500', borderColor: '#FEE500', color: '#191919', '&:hover': { bgcolor: '#F5DC00', borderColor: '#F5DC00' } }}
              disabled
            >
              카카오로 로그인 (준비중)
            </Button>
            <Button
              fullWidth variant="outlined"
              sx={{ bgcolor: '#03C75A', borderColor: '#03C75A', color: '#fff', '&:hover': { bgcolor: '#02B050', borderColor: '#02B050' } }}
              disabled
            >
              네이버로 로그인 (준비중)
            </Button>
          </Stack>

          <Typography variant="body2" textAlign="center" mt={3}>
            아직 계정이 없으신가요?{' '}
            <Link component={RouterLink} to="/signup" fontWeight={600}>회원가입</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default LoginPage
