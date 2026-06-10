import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'

const TopBar = ({ title, showBack = false, rightAction }) => {
  const navigate = useNavigate()

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ minHeight: 52, px: 2 }}>
        {showBack && (
          <IconButton edge="start" onClick={() => navigate(-1)} sx={{ mr: 1, color: '#111' }}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: 700 }}>
          {title}
        </Typography>
        {rightAction}
      </Toolbar>
    </AppBar>
  )
}

export default TopBar
