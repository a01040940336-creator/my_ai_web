import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Paper from '@mui/material/Paper'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import { useNavigate, useLocation } from 'react-router-dom'

const TABS = [
  { label: 'HOME',     icon: <HomeOutlinedIcon />,           path: '/'         },
  { label: 'SEARCH',   icon: <SearchOutlinedIcon />,          path: '/search'   },
  { label: 'CALENDAR', icon: <CalendarTodayOutlinedIcon />,   path: '/calendar' },
  { label: 'SAVED',    icon: <BookmarkBorderIcon />,          path: '/saved'    },
  { label: 'PROFILE',  icon: <PersonOutlinedIcon />,          path: '/profile'  },
]

const BottomNav = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const currentTab = TABS.findIndex(t => t.path === location.pathname)

  return (
    <Paper elevation={0} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100 }}>
      <BottomNavigation
        value={currentTab === -1 ? false : currentTab}
        onChange={(_, v) => navigate(TABS[v].path)}
        showLabels
      >
        {TABS.map(tab => (
          <BottomNavigationAction
            key={tab.label}
            label={tab.label}
            icon={tab.icon}
            sx={{ minWidth: 0, fontSize: '0.5625rem' }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  )
}

export default BottomNav
