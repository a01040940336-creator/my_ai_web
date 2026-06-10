import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme'
import { AuthProvider } from './context/AuthContext'
import BottomNav from './components/BottomNav'
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import CalendarPage from './pages/CalendarPage'
import MyPage from './pages/MyPage'
import PostDetailPage from './pages/PostDetailPage'
import PostWritePage from './pages/PostWritePage'
import AuthPage from './pages/AuthPage'

const HIDE_NAV_PATHS = ['/auth', '/write']

const Layout = ({ children }) => {
  const location = useLocation()
  const hideNav = HIDE_NAV_PATHS.includes(location.pathname)
  return (
    <>
      {children}
      {!hideNav && <BottomNav />}
    </>
  )
}

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/post/:id" element={<PostDetailPage />} />
              <Route path="/write" element={<PostWritePage />} />
              <Route path="/auth" element={<AuthPage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
