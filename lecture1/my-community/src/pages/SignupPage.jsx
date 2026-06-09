import React, { useState } from 'react'
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Alert, Link, Stack, LinearProgress, InputAdornment, CircularProgress
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { supabase } from '../supabase'

const getPasswordStrength = (pw) => {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

const USERNAME_REGEX = /^[a-z0-9_]{4,20}$/

const SignupPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirmPassword: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [usernameCheck, setUsernameCheck] = useState(null) // null | 'checking' | 'ok' | 'taken' | 'invalid'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (e.target.name === 'username') setUsernameCheck(null)
  }

  const checkUsername = async () => {
    const uname = form.username.toLowerCase().trim()
    if (!USERNAME_REGEX.test(uname)) { setUsernameCheck('invalid'); return }
    setUsernameCheck('checking')
    const { data } = await supabase.from('profiles').select('id').eq('username', uname).maybeSingle()
    setUsernameCheck(data ? 'taken' : 'ok')
  }

  const validate = () => {
    if (usernameCheck !== 'ok') return '아이디 중복확인을 완료해 주세요.'
    if (form.password.length < 8) return '비밀번호는 8자 이상이어야 합니다.'
    if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password)) return '비밀번호는 영문과 숫자를 포함해야 합니다.'
    if (form.password !== form.confirmPassword) return '비밀번호가 일치하지 않습니다.'
    if (!agreed) return '이용약관에 동의해 주세요.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    setLoading(true)

    const { error: authErr } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          name: form.name,
          username: form.username.toLowerCase().trim(),
          phone: form.phone,
        }
      }
    })

    if (authErr) { setError(authErr.message); setLoading(false); return }
    navigate('/', { state: { message: '회원가입이 완료됐어요! 이메일을 확인해 주세요.' } })
  }

  const pwStrength = getPasswordStrength(form.password)
  const strengthColor = ['error', 'error', 'warning', 'info', 'success'][pwStrength]

  const usernameEndAdornment = () => {
    if (usernameCheck === 'checking') return <InputAdornment position="end"><CircularProgress size={16} /></InputAdornment>
    if (usernameCheck === 'ok') return <InputAdornment position="end"><CheckCircleIcon color="success" fontSize="small" /></InputAdornment>
    if (usernameCheck === 'taken') return <InputAdornment position="end"><CancelIcon color="error" fontSize="small" /></InputAdornment>
    return null
  }

  const usernameHelperText = () => {
    if (usernameCheck === 'ok') return '사용 가능한 아이디입니다.'
    if (usernameCheck === 'taken') return '이미 사용 중인 아이디입니다.'
    if (usernameCheck === 'invalid') return '4~20자, 영문 소문자/숫자/밑줄(_)만 사용 가능합니다.'
    return '4~20자, 영문 소문자/숫자/밑줄(_)'
  }

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
              </Stack>

              {/* 아이디 + 중복확인 */}
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <TextField
                  label="아이디" name="username" value={form.username}
                  onChange={handleChange} required fullWidth size="small"
                  inputProps={{ autoCapitalize: 'none' }}
                  InputProps={{ endAdornment: usernameEndAdornment() }}
                  helperText={usernameHelperText()}
                  error={usernameCheck === 'taken' || usernameCheck === 'invalid'}
                  color={usernameCheck === 'ok' ? 'success' : 'primary'}
                />
                <Button
                  variant="outlined" size="small"
                  onClick={checkUsername}
                  disabled={usernameCheck === 'checking' || !form.username}
                  sx={{ flexShrink: 0, height: 40, mt: 0 }}
                >
                  중복확인
                </Button>
              </Stack>

              <TextField label="이메일" name="email" type="email" value={form.email} onChange={handleChange} required fullWidth size="small" />
              <TextField label="전화번호" name="phone" value={form.phone} onChange={handleChange} fullWidth size="small" placeholder="010-0000-0000" />

              <Box>
                <TextField
                  label="비밀번호" name="password" type="password" value={form.password}
                  onChange={handleChange} required fullWidth size="small"
                  helperText="8자 이상, 영문/숫자 포함"
                />
                {form.password && (
                  <LinearProgress variant="determinate" value={(pwStrength / 4) * 100}
                    color={strengthColor} sx={{ mt: 0.5, borderRadius: 1 }} />
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
