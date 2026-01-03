import { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Snackbar
} from '@mui/material'

// Default API URL for exchange rates
const DEFAULT_API_URL = 'https://currency-rates-api-gdwf.onrender.com/rates.json'

function SettingsView() {
  // Initialize API URL from localStorage or default
  const [apiUrl, setApiUrl] = useState(() => {
    const savedUrl = localStorage.getItem('exchangeRatesUrl')
    return savedUrl || DEFAULT_API_URL
  })
  // State for snackbar notifications
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  // Handle input change for API URL
  const handleChange = (event) => {
    setApiUrl(event.target.value)
  }

  // Save the API URL to localStorage
  const handleSave = () => {
    try {
      // Save to localStorage
      localStorage.setItem('exchangeRatesUrl', apiUrl)

      setSnackbar({
        open: true,
        message: 'Exchange rate API URL saved successfully!',
        severity: 'success'
      })
    } catch (error) {
      console.error('Failed to save settings:', error)
      setSnackbar({
        open: true,
        message: 'Failed to save settings',
        severity: 'error'
      })
    }
  }

  // Reset to default API URL
  const handleReset = () => {
    setApiUrl(DEFAULT_API_URL)
    localStorage.setItem('exchangeRatesUrl', DEFAULT_API_URL)

    setSnackbar({
      open: true,
      message: 'Reset to default API URL',
      severity: 'info'
    })
  }

  // Close the snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mt: 3, maxWidth: 800 }}>
        <Typography variant="h6" gutterBottom>
          Exchange Rate API Configuration
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Configure the API URL for fetching currency exchange rates. The API should return exchange rates in JSON format.
        </Typography>

        <TextField
          fullWidth
          label="API URL"
          value={apiUrl}
          onChange={handleChange}
          placeholder={DEFAULT_API_URL}
          helperText="Enter the URL for the exchange rate API"
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            size="large"
          >
            Save Settings
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={handleReset}
            size="large"
          >
            Reset to Default
          </Button>
        </Box>

        <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Default API URL:
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
            {DEFAULT_API_URL}
          </Typography>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default SettingsView
