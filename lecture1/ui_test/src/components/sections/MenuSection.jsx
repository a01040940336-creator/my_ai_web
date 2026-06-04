import React, { useState } from 'react'
import {
  Box, Button, Menu, MenuItem, ListItemIcon, ListItemText,
  Typography, Chip, Divider,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import NotificationsIcon from '@mui/icons-material/Notifications'
import HelpIcon from '@mui/icons-material/Help'
import LogoutIcon from '@mui/icons-material/Logout'
import SectionBlock from './SectionBlock'

const MENU_ITEMS = [
  { value: 'home',          label: '홈',       icon: <HomeIcon fontSize="small" /> },
  { value: 'profile',       label: '프로필',   icon: <PersonIcon fontSize="small" /> },
  { value: 'notifications', label: '알림',     icon: <NotificationsIcon fontSize="small" /> },
  { value: 'settings',      label: '설정',     icon: <SettingsIcon fontSize="small" /> },
  { value: 'help',          label: '도움말',   icon: <HelpIcon fontSize="small" />, dividerBefore: true },
  { value: 'logout',        label: '로그아웃', icon: <LogoutIcon fontSize="small" color="error" />, color: 'error.main' },
]

const MenuSection = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selected, setSelected] = useState(null)

  const open = Boolean(anchorEl)

  const handleOpen = (e) => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)
  const handleSelect = (item) => {
    setSelected(item)
    handleClose()
  }

  return (
    <SectionBlock title="13. Menu">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
        <Button
          variant="contained"
          onClick={handleOpen}
          aria-controls={open ? 'main-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          메뉴 열기
        </Button>

        <Menu
          id="main-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        >
          {MENU_ITEMS.map((item) => [
            item.dividerBefore && <Divider key={`divider-${item.value}`} />,
            <MenuItem key={item.value} onClick={() => handleSelect(item)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" color={item.color ?? 'text.primary'}>
                    {item.label}
                  </Typography>
                }
              />
            </MenuItem>,
          ])}
        </Menu>

        <Box sx={{ minHeight: 28 }}>
          {selected
            ? <Chip
                icon={selected.icon}
                label={`선택: ${selected.label}`}
                color="primary"
                size="small"
              />
            : <Typography variant="body2" color="text.disabled">선택 전</Typography>
          }
        </Box>
      </Box>
    </SectionBlock>
  )
}

export default MenuSection
