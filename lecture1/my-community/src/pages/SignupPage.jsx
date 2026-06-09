import React, { useState } from 'react'
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Alert, Link, Stack, MenuItem, LinearProgress
} from '@mui/material'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { supabase } from '../supabase'

const REGIONS = ['서울 강남구', '서울 마포구', '서울 성동구', '서울 용산구', '서울 종로구', '부산 해운대구', '인천 연수구', '기타']

const getPasswordStrength = (pw) => {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}

const SignupPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', nickname: '', email: '', password: '', confirmPassword: '', phone: '', region: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const validate = () => {
    if (form.password.length < 8) return '비밀번호는 8자 이상이어야 합니다.'
    if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password)) return '비밀번호는 영문과 숫자를 포함해야 합니다.'
    if (form.password !== form.confirmPassword) return '비밀번호가 일치하지 않습니다.'
    if (!form.nickname.trim()) return '닉네임을 입력해 주세요.'
    if (!agreed) return '이용약관에 동의해 주세요.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { name: form.name, nickname: form.nickname, phone: form.phone, region: form.region }
      }
    })

    if (error) { setError(error.message); setLoading(false); return }

    navigate('/', { state: { message: '회원가입이 완료되었습니다! 이메일을 확인해 주세요.' } })
  }

  const pwStrength = getPasswordStrength(form.password)
  const strengthColor = ['error', 'error', 'warning', 'info', 'success'][pwStrength]

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2, py: 4 }}>
      <Card sx={{ width: '100%', maxWidth: 480 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" color="primary" fontWeight={800}>집담</Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>회원가입</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5}>
                <TextField label="이름" name="name" value={form.name} onChange={handleChange} fullWidth size="small" />
                <TextField
                  label="닉네임" name="nickname" value={form.nickname} onChange={handleChange}
                  required fullWidth size="small"
                />
              </Stack>
              <TextField label="이메일" name="email" type="email" value={form.email} onChange={handleChange} required fullWidth size="small" />
              <TextField label="전화번호" name="phone" value={form.phone} onChange={handleChange} fullWidth size="small" placeholder="010-0000-0000" />
              <TextField
                label="관심 지역" name="region" select value={form.region} onChange={handleChange} fullWidth size="small"
              >
                {REGIONS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </TextField>
              <Box>
                <TextField
                  label="비밀번호" name="password" type="password" value={form.password}
                  onChange={handleChange} required fullWidth size="small"
                  helperText="8자 이상, 영문/숫자 포함"
                />
                {form.password && (
                  <LinearProgress
                    variant="determinate" value={(pwStrength / 4) * 100}
                    color={strengthColor} sx={{ mt: 0.5, borderRadius: 1 }}
                  />
                )}
              </Box>
              <TextField
                label="비밀번호 확인" name="confirmPassword" type="password" value={form.confirmPassword}
                onChange={handleChange} required fullWidth size="small"
                error={form.confirmPassword !== '' && form.password !== form.confirmPassword}
                helperText={form.confirmPassword !== '' && form.password !== form.confirmPassword ? '비밀번호가 일치하지 않습니다.' : ''}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <input type="checkbox" id="agree" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                <label htmlFor="agree" style={{ fontSize: 13 }}>
                  <Link href="#" underline="always">이용약관</Link> 및 <Link href="#" underline="always">개인정보처리방침</Link>에 동의합니다 (필수)
                </label>
              </Box>

              <Button type="submit" variant="contained" fullWidth disabled={loading} size="large">
                {loading ? '가입 중...' : '회원가입'}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" textAlign="center" mt={2}>
            이미 계정이 있으신가요?{' '}
            <Link component={RouterLink} to="/login" fontWeight={600}>로그인</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default SignupPage
