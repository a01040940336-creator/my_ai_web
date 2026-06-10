import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme'
import { AuthProvider } from './context/AuthContext'
import BottomNav from './components/BottomNav'
import HomePage       from './pages/HomePage'
import SearchPage     from './pages/SearchPage'
import CalendarPage   from './pages/CalendarPage'
import SavedPage      from './pages/SavedPage'
import ProfilePage    from './pages/ProfilePage'
import PostDetailPage from './pages/PostDetailPage'
import PostWritePage  from './pages/PostWritePage'
import AuthPage       from './pages/AuthPage'

const HIDE_NAV = ['/auth', '/write']

const Layout = ({ children }) => {
  const { pathname } = useLocation()
  return (
    <>
      {children}
      {!HIDE_NAV.includes(pathname) && <BottomNav />}
    </>
  )
}

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Layout>
          <Routes>
            <Route path="/"            element={<HomePage />} />
            <Route path="/search"      element={<SearchPage />} />
            <Route path="/search/map"  element={<SearchPage />} />
            <Route path="/calendar"    element={<CalendarPage />} />
            <Route path="/saved"       element={<SavedPage />} />
            <Route path="/profile"     element={<ProfilePage />} />
            <Route path="/post/:id"    element={<PostDetailPage />} />
            <Route path="/write"       element={<PostWritePage />} />
            <Route path="/auth"        element={<AuthPage />} />
            {/* 이전 경로 호환 */}
            <Route path="/explore"     element={<SearchPage />} />
            <Route path="/mypage"      element={<ProfilePage />} />
            {/* fallback */}
            <Route path="*"            element={<HomePage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
)

export default App
