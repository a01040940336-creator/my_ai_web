import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Paper from '@mui/material/Paper'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined'
import { useNavigate, useLocation } from 'react-router-dom'

const tabs = [
  { label: '홈', icon: <HomeOutlinedIcon />, path: '/' },
  { label: '탐색', icon: <SearchOutlinedIcon />, path: '/explore' },
  { label: '캘린더', icon: <CalendarTodayOutlinedIcon />, path: '/calendar' },
  { label: '마이', icon: <PersonOutlineIcon />, path: '/mypage' },
]

const BottomNav = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const currentTab = tabs.findIndex(t => t.path === location.pathname)

  return (
    <Paper
      elevation={0}
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100 }}
    >
      <BottomNavigation
        value={currentTab === -1 ? 0 : currentTab}
        onChange={(_, newValue) => navigate(tabs[newValue].path)}
        showLabels
      >
        {tabs.map(tab => (
          <BottomNavigationAction key={tab.label} label={tab.label} icon={tab.icon} />
        ))}
      </BottomNavigation>
    </Paper>
  )
}

export default BottomNav
