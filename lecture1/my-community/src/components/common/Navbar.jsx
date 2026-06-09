import React, { useState } from 'react'
import {
  AppBar, Toolbar, Typography, Button, IconButton, Avatar,
  Menu, MenuItem, Box, InputBase, useTheme, Drawer,
  List, ListItem, ListItemText, Divider
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import EditNoteIcon from '@mui/icons-material/EditNote'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { user, profile, signOut } = useAuth()
  const [anchorEl, setAnchorEl] = useState(null)
  const [searchValue, setSearchValue] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      navigate(`/posts?search=${encodeURIComponent(searchValue.trim())}`)
      setMobileMenuOpen(false)
    }
  }

  const handleMenuClose = () => setAnchorEl(null)

  const handleLogout = async () => {
    await signOut()
    handleMenuClose()
    setMobileMenuOpen(false)
    navigate('/')
  }

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Toolbar sx={{ gap: 1, minHeight: { xs: 52, sm: 64 } }}>
          {/* 로고 */}
          <Typography
            variant="h6"
            onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            sx={{ cursor: 'pointer', color: 'primary.main', fontWeight: 800, fontSize: '1.3rem', flexShrink: 0 }}
          >
            집담
          </Typography>

          {/* 검색바 - sm 이상만 표시 */}
          <Box sx={{
            display: { xs: 'none', sm: 'flex' }, alignItems: 'center',
            bgcolor: 'background.default', border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2, px: 1.5, py: 0.5, flex: 1, maxWidth: 400,
          }}>
            <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 18 }} />
            <InputBase
              placeholder="게시물, 유저 검색..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearch}
              sx={{ fontSize: 13, width: '100%' }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', ml: 'auto' }}>
            {/* 모바일 검색 아이콘 */}
            <IconButton size="small" sx={{ display: { xs: 'flex', sm: 'none' } }}
              onClick={() => navigate('/posts')}>
              <SearchIcon fontSize="small" />
            </IconButton>

            {user ? (
              <>
                <IconButton size="small" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                  <NotificationsNoneIcon />
                </IconButton>

                {/* 글쓰기: sm+ 텍스트, xs 아이콘만 */}
                <Button
                  variant="contained" size="small"
                  onClick={() => navigate('/write')}
                  startIcon={<EditNoteIcon />}
                  sx={{ display: { xs: 'none', sm: 'flex' } }}
                >
                  글쓰기
                </Button>
                <IconButton
                  color="primary" size="small"
                  onClick={() => navigate('/write')}
                  sx={{ display: { xs: 'flex', sm: 'none' }, bgcolor: 'primary.main', color: 'white', borderRadius: 1, '&:hover': { bgcolor: 'primary.dark' } }}
                >
                  <EditNoteIcon fontSize="small" />
                </IconButton>

                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
                  <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.main', fontSize: 13 }}>
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
                {/* 데스크탑 */}
                <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 0.5 }}>
                  <Button variant="text" size="small" onClick={() => navigate('/login')}>로그인</Button>
                  <Button variant="contained" size="small" onClick={() => navigate('/signup')}>회원가입</Button>
                </Box>
                {/* 모바일 햄버거 */}
                <IconButton size="small" sx={{ display: { xs: 'flex', sm: 'none' } }} onClick={() => setMobileMenuOpen(true)}>
                  <MenuIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* 모바일 드로어 메뉴 (비로그인) */}
      <Drawer anchor="right" open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        <Box sx={{ width: 240, pt: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1 }}>
            <IconButton onClick={() => setMobileMenuOpen(false)}><CloseIcon /></IconButton>
          </Box>

          {/* 모바일 검색 */}
          <Box sx={{ mx: 2, mb: 2, display: 'flex', alignItems: 'center', bgcolor: 'background.default', border: `1px solid ${theme.palette.divider}`, borderRadius: 2, px: 1.5, py: 0.5 }}>
            <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 18 }} />
            <InputBase
              placeholder="검색..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearch}
              sx={{ fontSize: 13, width: '100%' }}
            />
          </Box>

          <Divider />
          <List dense>
            <ListItem button onClick={() => { navigate('/login'); setMobileMenuOpen(false) }}>
              <ListItemText primary="로그인" />
            </ListItem>
            <ListItem button onClick={() => { navigate('/signup'); setMobileMenuOpen(false) }}>
              <ListItemText primary="회원가입" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => { navigate('/posts'); setMobileMenuOpen(false) }}>
              <ListItemText primary="게시물 목록" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  )
}

export default Navbar
