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
  CssBaseline
} from '@mui/material'
import AddCostView from './components/AddCostView'
import ReportsView from './components/ReportsView'
import SettingsView from './components/SettingsView'
import './App.css'
import theme from './config/theme'

// App.jsx - Root application component
// Provides top-level theme and tab navigation between feature views.

function App() {
  const [currentTab, setCurrentTab] = useState(0)

  // Handle tab change event - update current tab index
  const handleTabChange = (_event, newValue) => {
    setCurrentTab(newValue)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        {/* Top navigation bar */}
        <AppBar position="static" color="transparent" elevation={0} className="gradient-appbar">
          {/* Header toolbar with application title */}
          <Toolbar>
            <Typography variant="h5" component="div" className="app-logo-text" sx={{ flexGrow: 1, fontWeight: 700 }}>
              Cost Manager
            </Typography>
          </Toolbar>

          {/* Main navigation tabs - switch between app sections */}
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
            centered
            className="app-tabs"
          >
            {/* Tab: Add new cost */}
            <Tab label="Add Cost" />
            {/* Tab: Reports and charts */}
            <Tab label="Reports & Charts" />
            {/* Tab: Application settings */}
            <Tab label="Settings" />
          </Tabs>
        </AppBar>

        {/* Main content container with selected view */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {/* Render views based on the selected tab index */}
          {currentTab === 0 && <AddCostView />}
          {currentTab === 1 && <ReportsView />}
          {currentTab === 2 && <SettingsView />}
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
