import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Divider,
  LinearProgress,
  Chip,
  Grid
} from '@mui/material'

const CURRENCIES = ['USD', 'ILS', 'GBP', 'EURO']
const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D']

function ReportsView() {
  const [db, setDb] = useState(null)
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  const [reportData, setReportData] = useState(null)
  const [yearlyData, setYearlyData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Generate year options (current year and 5 years back)
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i)

  // Initialize IndexedDB on component mount
  useEffect(() => {
    const initDB = async () => {
      try {
        const database = await window.idb.openCostsDB('costsdb', 1)
        setDb(database)
      } catch (error) {
        console.error('Failed to open database:', error)
        setError('Failed to initialize database')
      }
    }
    initDB()
  }, [])

  const handleGenerateReport = async () => {
    if (!db) {
      setError('Database not initialized')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Get report for selected month
      const report = await db.getReport(selectedYear, selectedMonth, selectedCurrency)
      setReportData(report)

      // Get reports for all 12 months to build the bar chart
      const yearlyReports = await Promise.all(
        MONTHS.map(async (month) => {
          const monthReport = await db.getReport(selectedYear, month.value, selectedCurrency)
          return {
            month: month.label.substring(0, 3), // Short month name
            total: monthReport.total.total
          }
        })
      )
      setYearlyData(yearlyReports)
    } catch (err) {
      console.error('Failed to generate report:', err)
      setError('Failed to generate report')
    } finally {
      setLoading(false)
    }
  }

  // Generate pie chart data from report
  const getPieChartData = () => {
    if (!reportData || !reportData.costs.length) return []

    const categoryTotals = {}
    reportData.costs.forEach((cost) => {
      if (!categoryTotals[cost.category]) {
        categoryTotals[cost.category] = 0
      }
      categoryTotals[cost.category] += cost.sum
    })

    return Object.keys(categoryTotals).map((category) => ({
      name: category,
      value: Number(categoryTotals[category].toFixed(2))
    }))
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reports & Charts
      </Typography>

      {/* Filters */}
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Month</InputLabel>
              <Select
                value={selectedMonth}
                label="Month"
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {MONTHS.map((month) => (
                  <MenuItem key={month.value} value={month.value}>
                    {month.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Currency</InputLabel>
              <Select
                value={selectedCurrency}
                label="Currency"
                onChange={(e) => setSelectedCurrency(e.target.value)}
              >
                {CURRENCIES.map((currency) => (
                  <MenuItem key={currency} value={currency}>
                    {currency}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleGenerateReport}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Report'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {/* Report Table */}
      {reportData && (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            Monthly Report - {MONTHS.find((m) => m.value === selectedMonth)?.label} {selectedYear}
          </Typography>

          {reportData.costs.length > 0 ? (
            <>
              <TableContainer sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Day</strong></TableCell>
                      <TableCell><strong>Category</strong></TableCell>
                      <TableCell><strong>Description</strong></TableCell>
                      <TableCell align="right"><strong>Amount</strong></TableCell>
                      <TableCell align="right"><strong>Currency</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.costs.map((cost, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{cost.Date.day}</TableCell>
                        <TableCell>{cost.category}</TableCell>
                        <TableCell>{cost.description}</TableCell>
                        <TableCell align="right">{cost.sum.toFixed(2)}</TableCell>
                        <TableCell align="right">{cost.currency}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h6" color="primary">
                  Total: {reportData.total.total.toFixed(2)} {reportData.total.currency}
                </Typography>
              </Box>
            </>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              No costs found for this month.
            </Alert>
          )}
        </Paper>
      )}

      {/* Charts */}
      {reportData && reportData.costs.length > 0 && (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Category Distribution */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Cost Distribution by Category
              </Typography>
              <Box sx={{ mt: 3 }}>
                {getPieChartData().map((category, index) => {
                  const total = reportData.total.total
                  const percentage = (category.value / total) * 100
                  return (
                    <Box key={category.name} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          />
                          <Typography variant="body2">{category.name}</Typography>
                        </Box>
                        <Typography variant="body2" fontWeight="bold">
                          {category.value.toFixed(2)} ({percentage.toFixed(1)}%)
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: COLORS[index % COLORS.length],
                            borderRadius: 4
                          }
                        }}
                      />
                    </Box>
                  )
                })}
              </Box>
            </Paper>
          </Grid>

          {/* Yearly Trend */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Monthly Trend for {selectedYear}
              </Typography>
              <Box sx={{ mt: 3 }}>
                {yearlyData.map((month) => {
                  const maxValue = Math.max(...yearlyData.map(m => m.total))
                  const percentage = maxValue > 0 ? (month.total / maxValue) * 100 : 0
                  return (
                    <Box key={month.month} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Chip
                          label={month.month}
                          size="small"
                          sx={{ minWidth: 50 }}
                        />
                        <Typography variant="body2" fontWeight="bold">
                          {month.total.toFixed(2)} {selectedCurrency}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#1976d2',
                            borderRadius: 5
                          }
                        }}
                      />
                    </Box>
                  )
                })}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}

export default ReportsView
