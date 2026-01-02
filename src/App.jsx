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

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
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
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Cost Manager
            </Typography>
          </Toolbar>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
            centered
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
