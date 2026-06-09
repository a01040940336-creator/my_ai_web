import React, { useState } from 'react'
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Divider, Alert, Link, Stack
} from '@mui/material'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { supabase } from '../supabase'

const LoginPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // 아이디로 이메일 조회
    const { data: profileData, error: profileErr } = await supabase
      .from('profiles')
      .select('email')
      .eq('username', form.username.toLowerCase().trim())
      .single()

    if (profileErr || !profileData?.email) {
      setError('존재하지 않는 아이디입니다.')
      setLoading(false)
      return
    }

    const { error: authErr } = await supabase.auth.signInWithPassword({
      email: profileData.email,
      password: form.password,
    })

    if (authErr) setError('비밀번호가 올바르지 않습니다.')
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
                label="아이디"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                fullWidth
                size="small"
                placeholder="가입 시 설정한 아이디"
                inputProps={{ autoCapitalize: 'none' }}
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
            <Button fullWidth variant="outlined" disabled
              sx={{ bgcolor: '#FEE500', borderColor: '#FEE500', color: '#191919', '&:hover': { bgcolor: '#F5DC00', borderColor: '#F5DC00' } }}>
              카카오로 로그인 (준비중)
            </Button>
            <Button fullWidth variant="outlined" disabled
              sx={{ bgcolor: '#03C75A', borderColor: '#03C75A', color: '#fff', '&:hover': { bgcolor: '#02B050', borderColor: '#02B050' } }}>
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
