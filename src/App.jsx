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

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#8b5cf6',
      light: '#a855f7',
      dark: '#7c3aed',
    },
  },
  shape: {
    borderRadius: 12,
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
              boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.2)',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'all 300ms ease-in-out',
        },
      },
    },
  },
})

function App() {
  const [currentTab, setCurrentTab] = useState(0)

  const handleTabChange = (_event, newValue) => {
    setCurrentTab(newValue)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" className="gradient-appbar">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
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
