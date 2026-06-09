import React from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Box, Fab, Zoom } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import Navbar from './components/common/Navbar'
import SubNav from './components/common/SubNav'
import ScrollToTop from './components/common/ScrollToTop'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import PostsPage from './pages/PostsPage'
import PostDetailPage from './pages/PostDetailPage'
import WritePage from './pages/WritePage'
import MyPage from './pages/MyPage'
import { useAuth } from './context/AuthContext'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to="/login" replace />
}

// 글쓰기 FAB — 로그인 상태, 작성 페이지 제외, 모바일에서 표시
const WriteFab = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const hide = !user || location.hash.includes('/write') || location.hash.includes('/login') || location.hash.includes('/signup')
  return (
    <Zoom in={!hide}>
      <Fab
        color="secondary"
        size="medium"
        onClick={() => navigate('/write')}
        sx={{
          position: 'fixed',
          bottom: { xs: 24, sm: 32 },
          left: { xs: 24, sm: 32 },
          zIndex: 1200,
          display: { xs: 'flex', sm: 'none' }, // 모바일에서만 표시 (데스크탑은 Navbar에 있음)
          boxShadow: 4,
        }}
        aria-label="글쓰기"
      >
        <EditIcon />
      </Fab>
    </Zoom>
  )
}

function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <SubNav />
      <ScrollToTop />
      <WriteFab />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/write" element={<PrivateRoute><WritePage /></PrivateRoute>} />
        <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
      </Routes>
    </Box>
  )
}

export default App
