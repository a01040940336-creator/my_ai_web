import React, { useState } from 'react'
import {
  AppBar, Toolbar, Typography, Button, IconButton, Avatar,
  Menu, MenuItem, Box, InputBase, useTheme, Chip
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { user, profile, signOut } = useAuth()
  const [anchorEl, setAnchorEl] = useState(null)
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      navigate(`/posts?search=${encodeURIComponent(searchValue.trim())}`)
    }
  }

  const handleMenuClose = () => setAnchorEl(null)

  const handleLogout = async () => {
    await signOut()
    handleMenuClose()
    navigate('/')
  }

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: `1px solid ${theme.palette.divider}` }}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography
          variant="h6"
          onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          sx={{ cursor: 'pointer', color: 'primary.main', fontWeight: 800, fontSize: '1.4rem', flexShrink: 0 }}
        >
          집담
        </Typography>

        <Box sx={{
          display: 'flex', alignItems: 'center', bgcolor: 'background.default',
          border: `1px solid ${theme.palette.divider}`, borderRadius: 2,
          px: 1.5, py: 0.5, flex: 1, maxWidth: 400
        }}>
          <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
          <InputBase
            placeholder="게시물, 유저 검색..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearch}
            sx={{ fontSize: 14, width: '100%' }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 'auto' }}>
          {user ? (
            <>
              <IconButton size="small"><NotificationsNoneIcon /></IconButton>
              <Button variant="contained" size="small" onClick={() => navigate('/write')}>글쓰기</Button>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
                  {profile?.nickname?.[0] ?? user.email?.[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => { navigate('/mypage'); handleMenuClose() }}>마이페이지</MenuItem>
                <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button variant="text" size="small" onClick={() => navigate('/login')}>로그인</Button>
              <Button variant="contained" size="small" onClick={() => navigate('/signup')}>회원가입</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
