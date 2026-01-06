import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Grid,
  CircularProgress
} from '@mui/material'
import { CURRENCIES, MONTHS } from '../../config/constants'

// ReportFilters
// Presents UI controls to select year, month and currency for reports.
// Prop handlers are passed from the parent and receive primitive values.
function ReportFilters({
  selectedYear,
  selectedMonth,
  selectedCurrency,
  onYearChange,
  onMonthChange,
  onCurrencyChange,
  onGenerateReport,
  loading
}) {
  // Build a short range of years for the selector (current year and 5 previous).
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i)

  // Render the filter controls within a Paper container.
  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        {/* Year selector */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              label="Year"
              onChange={(e) => onYearChange(e.target.value)}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Month selector */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Month</InputLabel>
            <Select
              value={selectedMonth}
              label="Month"
              onChange={(e) => onMonthChange(e.target.value)}
            >
              {MONTHS.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Currency selector */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Currency</InputLabel>
            <Select
              value={selectedCurrency}
              label="Currency"
              onChange={(e) => onCurrencyChange(e.target.value)}
            >
              {CURRENCIES.map((currency) => (
                <MenuItem key={currency} value={currency}>
                  {currency}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Generate report button */}
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={onGenerateReport}
            sx={{ height: '56px' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Report'}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default ReportFilters
