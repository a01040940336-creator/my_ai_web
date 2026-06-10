import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import { useAuth } from '../context/AuthContext'

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    if (isSignUp) {
      const { error } = await signUp(email, password)
      if (error) setError(error.message)
      else setMessage('가입 확인 이메일을 보냈어요. 확인 후 로그인해주세요.')
    } else {
      const { error } = await signIn(email, password)
      if (error) setError('이메일 또는 비밀번호가 올바르지 않아요.')
      else navigate('/')
    }
    setLoading(false)
  }

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        bgcolor: '#fff',
      }}
    >
      {/* 로고 */}
      <Typography
        variant="h1"
        sx={{ fontWeight: 900, letterSpacing: '-0.04em', mb: 0.5, fontSize: '2rem' }}
      >
        POP SPOT
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 5 }}>
        팝업 · 전시 큐레이션 플랫폼
      </Typography>

      {/* 폼 */}
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 360 }}>
        {error && <Alert severity="error" sx={{ mb: 2, fontSize: '0.8125rem' }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ mb: 2, fontSize: '0.8125rem' }}>{message}</Alert>}

        <TextField
          fullWidth
          label="이메일"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          size="small"
          sx={{ mb: 1.5 }}
        />
        <TextField
          fullWidth
          label="비밀번호"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          size="small"
          inputProps={{ minLength: 6 }}
          sx={{ mb: 2.5 }}
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ py: 1.25, fontSize: '0.9375rem' }}
        >
          {loading ? '처리 중...' : isSignUp ? '회원가입' : '로그인'}
        </Button>
      </Box>

      <Button
        sx={{ mt: 2.5, color: '#666', textDecoration: 'underline', fontSize: '0.875rem' }}
        onClick={() => { setIsSignUp(v => !v); setError(''); setMessage('') }}
      >
        {isSignUp ? '이미 계정이 있어요 → 로그인' : '계정이 없어요 → 회원가입'}
      </Button>

      <Button
        sx={{ mt: 1, color: '#999', fontSize: '0.8125rem' }}
        onClick={() => navigate('/')}
      >
        로그인 없이 둘러보기
      </Button>
    </Box>
  )
}

export default AuthPage
