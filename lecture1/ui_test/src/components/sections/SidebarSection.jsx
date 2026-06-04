import React, { useState } from 'react'
import {
  Box, Button, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Typography, Divider,
  ToggleButtonGroup, ToggleButton, IconButton,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import InfoIcon from '@mui/icons-material/Info'
import BuildIcon from '@mui/icons-material/Build'
import MailIcon from '@mui/icons-material/Mail'
import ArticleIcon from '@mui/icons-material/Article'
import CloseIcon from '@mui/icons-material/Close'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import SectionBlock from './SectionBlock'

const NAV_ITEMS = [
  { label: '홈',      icon: <HomeIcon />,    desc: '메인 페이지' },
  { label: '소개',    icon: <InfoIcon />,    desc: 'About Us' },
  { label: '서비스',  icon: <BuildIcon />,   desc: '제공 서비스 목록' },
  { label: '블로그',  icon: <ArticleIcon />, desc: '최신 포스트' },
  { label: '연락처',  icon: <MailIcon />,    desc: 'Contact' },
]

const SidebarSection = () => {
  const [open, setOpen] = useState(false)
  const [anchor, setAnchor] = useState('left')
  const [selected, setSelected] = useState(null)

  const handleAnchor = (_, value) => {
    if (value) setAnchor(value)
  }

  const handleSelect = (label) => {
    setSelected(label)
    setOpen(false)
  }

  return (
    <SectionBlock title="14. Sidebar">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>

        {/* 위치 선택 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            위치:
          </Typography>
          <ToggleButtonGroup value={anchor} exclusive onChange={handleAnchor} size="small">
            <ToggleButton value="left">왼쪽</ToggleButton>
            <ToggleButton value="right">오른쪽</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* 열기 버튼 */}
        <Button
          variant="contained"
          startIcon={<MenuOpenIcon />}
          onClick={() => setOpen(true)}
        >
          사이드바 열기 ({anchor === 'left' ? '왼쪽' : '오른쪽'})
        </Button>

        {/* 선택 결과 */}
        <Typography variant="body2" color="text.secondary">
          선택된 메뉴:{' '}
          <strong style={{ color: selected ? '#1976d2' : undefined }}>
            {selected ?? '—'}
          </strong>
        </Typography>
      </Box>

      {/* Drawer */}
      <Drawer anchor={anchor} open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 260, height: '100%', display: 'flex', flexDirection: 'column' }}>

          {/* 헤더 */}
          <Box
            sx={{
              px: 2, py: 1.5,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              backgroundColor: 'primary.main', color: 'white',
            }}
          >
            <Typography variant="h6" fontWeight={700}>MyApp</Typography>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          {/* 네비게이션 */}
          <List sx={{ flexGrow: 1, pt: 1 }}>
            {NAV_ITEMS.map(({ label, icon, desc }) => (
              <ListItem key={label} disablePadding>
                <ListItemButton
                  selected={selected === label}
                  onClick={() => handleSelect(label)}
                  sx={{
                    borderRadius: 1, mx: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                      '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
                  <ListItemText
                    primary={label}
                    secondary={desc}
                    primaryTypographyProps={{ fontWeight: selected === label ? 700 : 400 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider />

          {/* 푸터 */}
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="caption" color="text.disabled">
              © 2026 MyApp. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </SectionBlock>
  )
}

export default SidebarSection
