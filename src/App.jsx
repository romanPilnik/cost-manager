import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Tabs,
  Tab,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material'
import AddCostView from './components/AddCostView'
import ReportsView from './components/ReportsView'
import SettingsView from './components/SettingsView'
import './App.css'

// Define the custom theme for the application
const theme = createTheme({
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
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h6: { fontWeight: 600, letterSpacing: '-0.01em' },
  },
  shape: {
    borderRadius: 16,
  },
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
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
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

function App() {
  const [currentTab, setCurrentTab] = useState(0)

  // Handle tab change event
  const handleTabChange = (_event, newValue) => {
    setCurrentTab(newValue)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="transparent" elevation={0} className="gradient-appbar">
          <Toolbar>
            <Typography variant="h5" component="div" className="app-logo-text" sx={{ flexGrow: 1, fontWeight: 700 }}>
              Cost Manager
            </Typography>
          </Toolbar>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
            centered
            className="app-tabs"
          >
            <Tab label="Add Cost" />
            <Tab label="Reports & Charts" />
            <Tab label="Settings" />
          </Tabs>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {currentTab === 0 && <AddCostView />}
          {currentTab === 1 && <ReportsView />}
          {currentTab === 2 && <SettingsView />}
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
