import { useState } from 'react'
import '../styles/SettingsView.css'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Snackbar
} from '@mui/material'
import { DEFAULT_EXCHANGE_RATES_URL, getExchangeRatesUrl, setExchangeRatesUrl } from '../config/api'

// SettingsView: configure application-level settings such as the
// exchange rates API URL. Uses localStorage for persistence.

function SettingsView() {
  // Initialize API URL from localStorage or default
  const [apiUrl, setApiUrl] = useState(() => getExchangeRatesUrl())
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
      setExchangeRatesUrl(apiUrl)

      setSnackbar({
        open: true,
        message: 'Exchange rate API URL saved successfully!',
        severity: 'success'
      })
    } catch (error) {
      // Log and notify user when saving fails (e.g., storage quota)
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
    // Reset the stored API URL and inform the user
    setApiUrl(DEFAULT_EXCHANGE_RATES_URL)
    setExchangeRatesUrl(DEFAULT_EXCHANGE_RATES_URL)

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
    <Box className="settings-view">
      <Typography variant="h4" gutterBottom className="page-header">
        Settings
      </Typography>

      <Paper elevation={3} className="settings-panel">
        <Typography variant="h6" gutterBottom>
          Exchange Rate API Configuration
        </Typography>
        {/* Short description about the expected API output */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Configure the API URL for fetching currency exchange rates. The API should return exchange rates in JSON format.
        </Typography>

        {/* Input where user provides the exchange rates API URL */}
        <TextField
          fullWidth
          label="API URL"
          value={apiUrl}
          onChange={handleChange}
          placeholder={DEFAULT_EXCHANGE_RATES_URL}
          helperText="Enter the URL for the exchange rate API"
          sx={{ mb: 3 }}
        />

        {/* Actions: Save and Reset */}
        <Box className="settings-button-group">
          {/* Save the current API URL to localStorage */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            size="large"
            className="settings-save-button"
          >
            Save Settings
          </Button>

          {/* Reset the API URL to the default value */}
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleReset}
            size="large"
            className="settings-reset-button"
          >
            Reset to Default
          </Button>
        </Box>
        {/* Display the current default API URL for reference */}
        <Box className="settings-info-box">
          <Typography variant="subtitle2" gutterBottom>
            Default API URL:
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
            {DEFAULT_EXCHANGE_RATES_URL}
          </Typography>
        </Box>
      </Paper>

      {/* Transient notifications shown at the bottom-center of the screen */}
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
