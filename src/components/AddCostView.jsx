import { useState, useEffect } from 'react'
import '../styles/AddCostView.css'
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Paper,
  Alert,
  Snackbar
} from '@mui/material'

import { CURRENCIES, CATEGORIES } from '../config/constants'
import idb from '../idb.module'

// Module: AddCostView
// Renders the form to add a new cost and handles client-side validation
// and persistence via the `idb` wrapper.

function AddCostView() {
  // Component state
  const [db, setDb] = useState(null)
  // Form data and initial values
  const [formData, setFormData] = useState({
    sum: '',
    currency: 'USD',
    category: '',
    description: ''
  })
  const [errors, setErrors] = useState({})
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  // Initialize IndexedDB on component mount
  useEffect(() => {
    const initDB = async () => {
      try {
        // Open or create the IndexedDB instance used by the app
        const database = await idb.openCostsDB('costsdb', 1)
        setDb(database)
      } catch (error) {
        console.error('Failed to open database:', error)
        setSnackbar({
          open: true,
          message: 'Failed to initialize database',
          severity: 'error'
        })
      }
    }
    // Initialize DB connection once on mount.
    initDB()
  }, [])

  const handleChange = (field) => (event) => {
    // Update local form state for the given field.
    setFormData({
      ...formData,
      [field]: event.target.value
    })
    // Clear error for this field when user starts typing
    if (errors[field]) {
      // Clear the individual field error so helper text disappears
      setErrors({
        ...errors,
        [field]: ''
      })
    }
  }

  const validateForm = () => {
    // Validate fields and collect messages for the user.
    const newErrors = {}

    // Amount validation
    if (!formData.sum || Number(formData.sum) <= 0) {
      newErrors.sum = 'Please enter a valid amount greater than 0'
    }

    // Currency must be selected
    if (!formData.currency) {
      newErrors.currency = 'Please select a currency'
    }

    // Category is required
    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }

    // Description must not be empty
    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description'
    }

    // Publish collected errors and indicate overall validity
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Validate input before attempting to save.
    if (!validateForm()) {
      return
    }

    if (!db) {
      setSnackbar({
        open: true,
        message: 'Database not initialized',
        severity: 'error'
      })
      return
    }

    try {
      // Prepare cost data for saving
      const costData = {
        sum: parseFloat(formData.sum),
        currency: formData.currency,
        category: formData.category,
        description: formData.description
      }

      // Use DB wrapper to persist the cost. `addCost` attaches current date.
      await db.addCost(costData)

      // Notify user of success
      setSnackbar({
        open: true,
        message: 'Cost added successfully!',
        severity: 'success'
      })

      // Reset form after successful submission so user can add another cost
      setFormData({
        sum: '',
        currency: 'USD',
        category: '',
        description: ''
      })
    } catch (error) {
      console.error('Failed to add cost:', error)
      setSnackbar({
        open: true,
        message: 'Failed to add cost',
        severity: 'error'
      })
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <Box className="add-cost-view">
      {/* Page header */}
      <Typography variant="h4" gutterBottom className="page-header">
        Add New Cost
      </Typography>

      <Paper elevation={3} className="add-cost-paper">
        <form onSubmit={handleSubmit}>
          {/* Amount input field */}
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={formData.sum}
            /* Input value, change handler and validation helpers */
            onChange={handleChange('sum')}
            error={!!errors.sum}
            helperText={errors.sum}
            slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
            sx={{ mb: 3 }}
            required
          />

          {/* Currency selection */}
          <FormControl fullWidth sx={{ mb: 3 }} error={!!errors.currency}>
            <InputLabel>Currency</InputLabel>
            <Select
              value={formData.currency}
              label="Currency"
              onChange={handleChange('currency')}
              required
            >
              {/* Currency options populated from shared constants */}
              {CURRENCIES.map((currency) => (
                <MenuItem key={currency} value={currency}>
                  {currency}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Category selection */}
          <FormControl fullWidth sx={{ mb: 3 }} error={!!errors.category}>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              label="Category"
              onChange={handleChange('category')}
              required
            >
              {/* Category options reused from shared constants */}
              {CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
            {errors.category && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                {errors.category}
              </Typography>
            )}
          </FormControl>

          {/* Description input */}
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={formData.description}
            /* Multi-line description input with helper text */
            onChange={handleChange('description')}
            error={!!errors.description}
            helperText={errors.description}
            sx={{ mb: 3 }}
            required
          />

          {/* Submit button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            className="add-cost-button"
            /* Primary submit action for the form */
          >
            Add Cost
          </Button>
        </form>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {/* Notification content shown in a dismissible alert */}
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default AddCostView
