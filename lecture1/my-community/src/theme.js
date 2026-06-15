import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#3B82F6',
      light: '#DBEAFE',
      dark: '#1D4ED8',
    },
    secondary: {
      main: '#34D399',
      light: '#A7F3D0',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
    divider: '#E5E7EB',
  },
  typography: {
    fontFamily: '"Pretendard", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 15,           // 기본 14→15px
    htmlFontSize: 16,

    h1: { fontSize: '2.25rem',  fontWeight: 800 },
    h2: { fontSize: '2rem',     fontWeight: 700 },
    h3: { fontSize: '1.625rem', fontWeight: 700 },
    h4: { fontSize: '1.375rem', fontWeight: 700 },
    h5: { fontSize: '1.2rem',   fontWeight: 700 },
    h6: { fontSize: '1.05rem',  fontWeight: 700 },

    subtitle1: { fontSize: '1rem',   fontWeight: 600, lineHeight: 1.5 },
    subtitle2: { fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.5 },

    body1: { fontSize: '1rem',   lineHeight: 1.7 },
    body2: { fontSize: '0.9rem', lineHeight: 1.6 },

    caption: { fontSize: '0.8rem', lineHeight: 1.4 },
    overline: { fontSize: '0.75rem' },

    button: { fontSize: '0.9rem', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
        sizeSmall: { fontSize: '0.85rem', padding: '4px 12px' },
        sizeMedium: { fontSize: '0.9rem' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        sizeSmall: { fontSize: '0.78rem', height: 24 },
        sizeMedium: { fontSize: '0.85rem' },
        label: { paddingLeft: 10, paddingRight: 10 },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: { fontSize: '0.9rem' },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: { fontSize: '0.9rem' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { fontSize: '0.9rem', fontWeight: 600 },
      },
    },
  },
})

export default theme
