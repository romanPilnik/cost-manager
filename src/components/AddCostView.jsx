import { useState, useEffect } from 'react'
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

const CURRENCIES = ['USD', 'ILS', 'GBP', 'EURO']
const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Other'
]

function AddCostView() {
  const [db, setDb] = useState(null)
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
        const database = await window.idb.openCostsDB('costsdb', 1)
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
    initDB()
  }, [])

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    })
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.sum || formData.sum <= 0) {
      newErrors.sum = 'Please enter a valid amount greater than 0'
    }

    if (!formData.currency) {
      newErrors.currency = 'Please select a currency'
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

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
      const costData = {
        sum: parseFloat(formData.sum),
        currency: formData.currency,
        category: formData.category,
        description: formData.description
      }

      await db.addCost(costData)

      setSnackbar({
        open: true,
        message: 'Cost added successfully!',
        severity: 'success'
      })

      // Reset form
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
    <Box>
      <Typography variant="h4" gutterBottom>
        Add New Cost
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mt: 3, maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={formData.sum}
            onChange={handleChange('sum')}
            error={!!errors.sum}
            helperText={errors.sum}
            slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
            sx={{ mb: 3 }}
            required
          />

          <FormControl fullWidth sx={{ mb: 3 }} error={!!errors.currency}>
            <InputLabel>Currency</InputLabel>
            <Select
              value={formData.currency}
              label="Currency"
              onChange={handleChange('currency')}
              required
            >
              {CURRENCIES.map((currency) => (
                <MenuItem key={currency} value={currency}>
                  {currency}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }} error={!!errors.category}>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              label="Category"
              onChange={handleChange('category')}
              required
            >
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

          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange('description')}
            error={!!errors.description}
            helperText={errors.description}
            sx={{ mb: 3 }}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
          >
            Add Cost
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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

export default AddCostView
