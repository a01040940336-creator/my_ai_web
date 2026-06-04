import { useState } from 'react'
import {
  AppBar, Avatar, Box, Chip, CssBaseline, Divider,
  Drawer, IconButton, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Toolbar, Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import GroupIcon from '@mui/icons-material/Group'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import EmailIcon from '@mui/icons-material/Email'
import Feed from './pages/Feed'

const DRAWER_WIDTH = 248

const navItems = [
  { label: '피드',   icon: <HomeIcon />,              emoji: '🏠', page: 'feed' },
  { label: '내 일상', icon: <PersonIcon />,            emoji: '🌸', page: 'my' },
  { label: '친구들', icon: <GroupIcon />,              emoji: '👫', page: 'friends' },
  { label: '알림',   icon: <NotificationsNoneIcon />,  emoji: '🔔', page: 'notifications' },
]

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState('feed')

  const drawer = (
    <Box sx={{ mt: 1 }}>
      {/* 프로필 카드 */}
      <Box
        sx={{
          mx: 2, mb: 2, p: 2.5,
          background: 'linear-gradient(135deg, #fce4ec 0%, #f3e5f5 100%)',
          borderRadius: 4,
          textAlign: 'center',
        }}
      >
        <Avatar
          sx={{
            width: 72, height: 72, mx: 'auto', mb: 1.5,
            background: 'linear-gradient(135deg, #f48fb1, #ce93d8)',
            fontSize: 34,
            boxShadow: '0 4px 16px rgba(244,143,177,0.4)',
          }}
        >
          🌸
        </Avatar>
        <Typography variant="subtitle1" fontWeight={800} color="primary.dark">
          안수은
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
          나의 귀여운 일상 기록 🌷
        </Typography>
        <Chip
          icon={<EmailIcon sx={{ fontSize: '13px !important' }} />}
          label="a01040940336@gmail.com"
          size="small"
          sx={{
            fontSize: 10, height: 22,
            bgcolor: 'white', color: 'primary.dark',
            border: '1px solid', borderColor: 'primary.light',
            maxWidth: '100%',
          }}
        />
      </Box>

      <Divider sx={{ mx: 2, mb: 1, borderColor: '#fce4ec' }} />

      {/* 네비게이션 */}
      <List sx={{ px: 1 }}>
        {navItems.map(({ label, icon, emoji, page }) => (
          <ListItem key={label} disablePadding>
            <ListItemButton
              selected={currentPage === page}
              onClick={() => { setCurrentPage(page); setMobileOpen(false) }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
              <ListItemText
                primary={`${emoji} ${label}`}
                primaryTypographyProps={{ fontSize: 14, fontWeight: 600 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* 하단 친구 목록 */}
      <Divider sx={{ mx: 2, mt: 2, mb: 1, borderColor: '#fce4ec' }} />
      <Box sx={{ px: 2, pb: 2 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600} mb={1} display="block">
          👫 친구들
        </Typography>
        {[
          { name: '김민지', avatar: '🌺', status: '온라인' },
          { name: '이지은', avatar: '🍀', status: '3시간 전' },
          { name: '박서연', avatar: '🌙', status: '어제' },
        ].map(f => (
          <Box key={f.name} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Avatar sx={{ width: 28, height: 28, fontSize: 14, background: 'linear-gradient(135deg, #ce93d8, #f48fb1)' }}>
              {f.avatar}
            </Avatar>
            <Box>
              <Typography variant="caption" fontWeight={600} display="block" lineHeight={1.2}>
                {f.name}
              </Typography>
              <Typography variant="caption" color={f.status === '온라인' ? 'success.main' : 'text.secondary'} sx={{ fontSize: 10 }}>
                {f.status}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )

  const currentNav = navItems.find(n => n.page === currentPage)

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* 헤더 */}
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <AutoAwesomeIcon sx={{ mr: 1, fontSize: 20 }} />
          <Typography variant="h6" noWrap fontWeight={800} sx={{ flexGrow: 1 }}>
            수은이의 일상 🌸
          </Typography>
          <Typography variant="body2" sx={{ mr: 1.5, fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
            안수은님 👋
          </Typography>
          <Avatar sx={{ width: 32, height: 32, background: 'linear-gradient(135deg, #fce4ec, #f3e5f5)', color: 'primary.dark', fontSize: 16 }}>
            🌸
          </Avatar>
        </Toolbar>
      </AppBar>

      {/* 사이드바 — 모바일 */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
      >
        {drawer}
      </Drawer>

      {/* 사이드바 — 데스크탑 */}
      <Drawer
        variant="permanent"
        sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}
        open
      >
        <Toolbar />
        {drawer}
      </Drawer>

      {/* 메인 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          ml: { sm: `${DRAWER_WIDTH}px` },
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
          bgcolor: 'background.default',
          maxWidth: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Box sx={{ maxWidth: 640, mx: 'auto' }}>
          {currentPage === 'feed' && <Feed />}
          {currentPage !== 'feed' && (
            <Box sx={{ textAlign: 'center', mt: 12 }}>
              <Typography sx={{ fontSize: 64, mb: 2 }}>{currentNav?.emoji}</Typography>
              <Typography variant="h6" fontWeight={700} color="primary.dark" mb={1}>
                {currentNav?.label}
              </Typography>
              <Typography color="text.secondary">곧 업데이트될 예정이에요 🌷</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}
