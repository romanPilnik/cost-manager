import { useState, useEffect } from 'react'
import './ReportsView.css'
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

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff', '#7c3aed', '#9333ea']

const CURRENCY_SYMBOLS = { USD: '$', ILS: '₪', GBP: '£', EURO: '€' }

// Helpers to draw pie chart slices as SVG paths
function polarToCartesian(cx, cy, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians)
  }
}

function describeSlicePath(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, endAngle)
  const end = polarToCartesian(cx, cy, radius, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`
}

function PieChart({ data = [], size = 200, currencySymbol = '' }) {
  const cx = size / 2
  const cy = size / 2
  const radius = Math.min(cx, cy)
  const total = data.reduce((s, d) => s + d.value, 0)
  // Precompute slice start/end angles to avoid mutating during render
  if (total === 0) {
    return (
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={cx} cy={cy} r={radius} fill="#f5f5f5" stroke="#e0e0e0" />
        </svg>
        <Box>
          {data.map((slice, i) => (
            <Box key={slice.name} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Box sx={{ width: 12, height: 12, backgroundColor: slice.color || COLORS[i % COLORS.length], borderRadius: '2px' }} />
              <Typography variant="body2" sx={{ minWidth: 120 }}>{slice.name}</Typography>
              <Typography variant="body2" fontWeight="bold">{currencySymbol}{slice.value.toFixed(2)}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>(0%)</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    )
  }

  const slices = []
  let cum = 0
  for (let i = 0; i < data.length; i++) {
    const slice = data[i]
    const start = cum
    cum += slice.value
    const end = cum
    slices.push({ ...slice, startAngle: (start / total) * 360, endAngle: (end / total) * 360 })
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <Box>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {slices.map((slice, i) => {
            const path = describeSlicePath(cx, cy, radius, slice.startAngle, slice.endAngle)
            const midAngle = (slice.startAngle + slice.endAngle) / 2
            const labelPos = polarToCartesian(cx, cy, radius * 0.6, midAngle)
            return (
              <g key={slice.name}>
                <path d={path} fill={slice.color || COLORS[i % COLORS.length]} stroke="#ffffff" strokeWidth="0.5" />
              </g>
            )
          })}
        </svg>
      </Box>
      <Box>
        {slices.map((slice, i) => (
          <Box key={slice.name} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Box sx={{ width: 12, height: 12, backgroundColor: slice.color || COLORS[i % COLORS.length], borderRadius: '2px' }} />
            <Typography variant="body2" sx={{ minWidth: 120 }}>{slice.name}</Typography>
            <Typography variant="body2" fontWeight="bold">{currencySymbol}{slice.value.toFixed(2)}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>({((slice.value / total) * 100).toFixed(1)}%)</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function BarChart({ data = [], width = 480, height = 220, currencySymbol = '' }) {
  const padding = { top: 20, right: 12, bottom: 36, left: 12 }
  const innerWidth = Math.max(0, width - padding.left - padding.right)
  const innerHeight = Math.max(0, height - padding.top - padding.bottom)
  const maxValue = data.length ? Math.max(...data.map(d => d.total)) : 0
  const barWidth = data.length ? innerWidth / data.length : 0

  return (
    <Box className="bar-chart">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(${padding.left},${padding.top})`}>
          {/* Bars */}
          {data.map((d, i) => {
            const h = maxValue > 0 ? (d.total / maxValue) * innerHeight : 0
            const x = i * barWidth + barWidth * 0.15
            const bw = Math.max(4, barWidth * 0.7)
            const y = innerHeight - h
            return (
              <g key={d.month}>
                <rect x={x} y={y} width={bw} height={h} rx={4} ry={4} fill="#6366f1" />
                <text x={x + bw / 2} y={y - 6} textAnchor="middle" fontSize={11} fill="#111">{currencySymbol}{d.total.toFixed(0)}</text>
                <text x={x + bw / 2} y={innerHeight + 14} textAnchor="middle" fontSize={12} fill="#333">{d.month}</text>
              </g>
            )
          })}
          {/* baseline */}
          <line x1={0} y1={innerHeight} x2={innerWidth} y2={innerHeight} stroke="#e0e0e0" />
        </g>
      </svg>
    </Box>
  )
}

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

    // Use static rates for consistent chart calculations
    const staticRates = { "USD": 1, "ILS": 3.67, "GBP": 0.79, "EURO": 0.95 };
    const targetCurrency = reportData && reportData.total && reportData.total.currency
      ? reportData.total.currency
      : selectedCurrency;

    const categoryTotals = {}
    reportData.costs.forEach((cost) => {
      // Convert each cost to target currency for chart calculations
      const itemRate = staticRates[cost.currency] || 1;
      const targetRate = staticRates[targetCurrency] || 1;
      const amountInUSD = cost.sum / itemRate;
      const convertedAmount = amountInUSD * targetRate;

      if (!categoryTotals[cost.category]) {
        categoryTotals[cost.category] = 0
      }
      categoryTotals[cost.category] += convertedAmount
    })

    return Object.keys(categoryTotals).map((category) => ({
      name: category,
      value: Number(categoryTotals[category].toFixed(2))
    }))
  }

  const reportCurrency = reportData && reportData.total && reportData.total.currency
    ? reportData.total.currency
    : selectedCurrency;

  const reportCurrencySymbol = CURRENCY_SYMBOLS[reportCurrency] || reportCurrency;

  return (
    <Box className="reports-view">
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
          <Grid container spacing={3} className="charts-grid" sx={{ mt: 1 }}>
          {/* Category Distribution */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} className="chart-paper" sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Cost Distribution by Category
              </Typography>
              <Box sx={{ mt: 3 }}>
                {(() => {
                  const pieData = getPieChartData()
                  // attach colors for consistent legend/slices
                  const pieWithColors = pieData.map((d, i) => ({ ...d, color: COLORS[i % COLORS.length] }))
                  return <PieChart data={pieWithColors} size={220} currencySymbol={reportCurrencySymbol} />
                })()}
              </Box>
            </Paper>
          </Grid>

          {/* Yearly Trend */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} className="chart-paper" sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Monthly Trend for {selectedYear}
              </Typography>
              <Box sx={{ mt: 3 }}>
                <BarChart data={yearlyData} width={520} height={260} currencySymbol={reportCurrencySymbol} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}

export default ReportsView
