import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#111111',
    },
    secondary: {
      main: '#666666',
    },
    error: {
      main: '#FF3B30',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111111',
      secondary: '#666666',
    },
    divider: '#EAEAEA',
  },
  typography: {
    fontFamily: '"Pretendard", "Noto Sans KR", -apple-system, sans-serif',
    h1: { fontWeight: 700, fontSize: '1.75rem' },
    h2: { fontWeight: 700, fontSize: '1.375rem' },
    h3: { fontWeight: 600, fontSize: '1.125rem' },
    h4: { fontWeight: 600, fontSize: '1rem' },
    body1: { fontSize: '0.9375rem', lineHeight: 1.6 },
    body2: { fontSize: '0.8125rem', lineHeight: 1.5, color: '#666666' },
    caption: { fontSize: '0.75rem', color: '#666666' },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4,
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        contained: {
          backgroundColor: '#111111',
          color: '#FFFFFF',
          '&:hover': { backgroundColor: '#333333' },
        },
        outlined: {
          borderColor: '#EAEAEA',
          color: '#111111',
          '&:hover': { borderColor: '#111111', backgroundColor: 'transparent' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 500,
          fontSize: '0.8125rem',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#111111',
          boxShadow: 'none',
          borderBottom: '1px solid #EAEAEA',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          borderTop: '1px solid #EAEAEA',
          height: 60,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: '#666666',
          '&.Mui-selected': { color: '#111111' },
          minWidth: 0,
        },
        label: {
          fontSize: '0.6875rem',
          '&.Mui-selected': { fontSize: '0.6875rem' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: '1px solid #EAEAEA',
          borderRadius: 8,
        },
      },
    },
  },
})

export default theme
