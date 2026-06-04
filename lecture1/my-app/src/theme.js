import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#f48fb1',
      light: '#fce4ec',
      dark: '#c2185b',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ce93d8',
      light: '#f3e5f5',
      dark: '#7b1fa2',
      contrastText: '#fff',
    },
    background: {
      default: '#fff8fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#5d4037',
      secondary: '#a1887f',
    },
  },
  typography: {
    fontFamily: '"Noto Sans KR", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #f48fb1 0%, #ce93d8 100%)',
          boxShadow: '0 2px 12px rgba(244,143,177,0.3)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, #fff0f6 0%, #f8f0ff 100%)',
          borderRight: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '2px 8px',
          '&.Mui-selected': {
            background: 'linear-gradient(90deg, #f48fb1, #ce93d8)',
            color: '#fff',
            '& .MuiListItemIcon-root': { color: '#fff' },
            '&:hover': {
              background: 'linear-gradient(90deg, #f06292, #ba68c8)',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 20, textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 20, boxShadow: '0 4px 20px rgba(244,143,177,0.15)' },
      },
    },
  },
  spacing: 8,
});

export default theme;
