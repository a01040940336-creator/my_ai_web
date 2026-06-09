import React from 'react'
import { Box, Button, Container, useTheme } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import ForumIcon from '@mui/icons-material/Forum'
import CampaignIcon from '@mui/icons-material/Campaign'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import KitchenIcon from '@mui/icons-material/Kitchen'
import { useNavigate, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { label: '홈', icon: <HomeIcon sx={{ fontSize: 16 }} />, path: '/', exact: true },
  { label: '전체 게시물', icon: <ForumIcon sx={{ fontSize: 16 }} />, path: '/posts', exact: true },
  { label: '자취꿀팁', icon: <LightbulbIcon sx={{ fontSize: 16 }} />, path: '/posts?category=%EC%9E%90%EC%B7%A8%EA%BF%80%ED%8C%81' },
  { label: '공동구매', icon: <ShoppingCartIcon sx={{ fontSize: 16 }} />, path: '/posts?category=%EA%B3%B5%EB%8F%99%EA%B5%AC%EB%A7%A4' },
  { label: '냉장고나눔', icon: <KitchenIcon sx={{ fontSize: 16 }} />, path: '/posts?category=%EB%83%89%EC%9E%A5%EA%B3%A0%EB%82%98%EB%88%94' },
  { label: '질문게시판', icon: <ForumIcon sx={{ fontSize: 16 }} />, path: '/posts?category=%EC%A7%88%EB%AC%B8%EA%B2%8C%EC%8B%9C%ED%8C%90' },
  { label: '공지사항', icon: <CampaignIcon sx={{ fontSize: 16 }} />, path: '/posts?category=%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD' },
]

const SubNav = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const fullPath = location.hash.replace('#', '') || '/'

  const isActive = (item) => {
    if (item.exact) return fullPath === item.path || fullPath.split('?')[0] === item.path
    return fullPath === item.path
  }

  return (
    <Box sx={{
      bgcolor: 'background.paper',
      borderBottom: `1px solid ${theme.palette.divider}`,
      position: 'sticky', top: { xs: 52, sm: 64 }, zIndex: 99,
    }}>
      <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 } }}>
        <Box sx={{
          display: 'flex', gap: 0.5, overflowX: 'auto',
          '&::-webkit-scrollbar': { display: 'none' },
          py: 0.5,
        }}>
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.label}
              startIcon={item.icon}
              size="small"
              onClick={() => navigate(item.path)}
              sx={{
                flexShrink: 0,
                fontSize: { xs: 11, sm: 12 },
                fontWeight: isActive(item) ? 700 : 400,
                color: isActive(item) ? 'primary.main' : 'text.secondary',
                borderBottom: isActive(item) ? '2px solid' : '2px solid transparent',
                borderColor: isActive(item) ? 'primary.main' : 'transparent',
                borderRadius: 0,
                px: { xs: 1, sm: 1.5 },
                py: 1,
                minWidth: 'auto',
                '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
                transition: 'all 0.15s',
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Container>
    </Box>
  )
}

export default SubNav
