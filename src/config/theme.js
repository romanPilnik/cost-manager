import { createTheme } from '@mui/material'

// theme.js
// Centralized MUI theme configuration for the app. Export a ready-to-use
// `theme` object
export const theme = createTheme({
  // Color palette definitions used across components
  palette: {
    mode: 'dark',
    primary: {
      main: '#818cf8', // Indigo 400
      light: '#a5b4fc',
      dark: '#6366f1',
    },
    secondary: {
      main: '#c084fc', // Violet 400
      light: '#d8b4fe',
      dark: '#a855f7',
    },
    background: {
      default: '#0f172a',
      paper: 'rgba(30, 41, 59, 0.7)', // Glassy Slate
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
    },
  },
  // Typography settings: font family and heading weights
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h6: { fontWeight: 600, letterSpacing: '-0.01em' },
  },
  // Shape tokens (border radii, etc.)
  shape: {
    borderRadius: 16,
  },
  // Shadow presets (kept shallow for a modern flat look)
  shadows: [
    'none',
    '0 2px 4px rgba(99, 102, 241, 0.1)',
    '0 4px 8px rgba(99, 102, 241, 0.12)',
    '0 8px 16px rgba(99, 102, 241, 0.15)',
    '0 8px 32px rgba(99, 102, 241, 0.15)',
    '0 12px 24px rgba(99, 102, 241, 0.18)',
    '0 16px 32px rgba(99, 102, 241, 0.2)',
    '0 20px 40px rgba(99, 102, 241, 0.22)',
    '0 24px 48px rgba(99, 102, 241, 0.24)',
    ...Array(16).fill('0 24px 48px rgba(99, 102, 241, 0.24)')
  ],
  // Component-specific style overrides
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // Buttons: preserve case and add subtle elevation on hover
          textTransform: 'none',
          fontWeight: 500,
          transition: 'all 300ms ease-in-out',
          borderRadius: '10px',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    // TextField tweaks to soften focus and hover interactions
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            transition: 'all 300ms ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 2px rgba(129, 140, 248, 0.2)',
            },
          },
        },
      },
    },
    // Paper surfaces with glassy backdrop and subtle border
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          transition: 'all 300ms ease-in-out',
        },
      },
    },
  },
})

export default theme
