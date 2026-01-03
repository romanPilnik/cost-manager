import { useState, useEffect } from 'react'
import './ReportsView.css'
import {
  Box,
  Typography,
  Paper,
  Alert,
} from '@mui/material'
import ReportFilters from './reports/ReportFilters'
import ReportTable from './reports/ReportTable'
import PieChart from './reports/PieChart'
import BarChart from './reports/BarChart'
import { MONTHS, COLORS, CURRENCY_SYMBOLS } from './reports/constants'

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
  const [rates, setRates] = useState({})

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

  // Fetch currency rates on component mount
  useEffect(() => {
    const fetchRates = async () => {
      const ratesUrl = localStorage.getItem('exchangeRatesUrl') || 'https://currency-rates-api-gdwf.onrender.com/rates.json'
      try {
        const response = await fetch(ratesUrl)
        const data = await response.json()
        setRates(data.rates || {})
      } catch (error) {
        console.error('Failed to fetch rates:', error)
        setError('Failed to fetch currency rates')
      }
    }
    fetchRates()
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
    if (!reportData || !reportData.costs.length || !rates) return []

    const targetCurrency = reportData && reportData.total && reportData.total.currency
      ? reportData.total.currency
      : selectedCurrency;

    const categoryTotals = {}
    reportData.costs.forEach((cost) => {
      // Convert each cost to target currency for chart calculations
      const itemRate = rates[cost.currency] || 1;
      const targetRate = rates[targetCurrency] || 1;
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
      <Typography variant="h4" gutterBottom className="page-header">
        Reports & Charts
      </Typography>

      {/* Filters for selecting year, month, and currency */}
      <ReportFilters
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        selectedCurrency={selectedCurrency}
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
        onCurrencyChange={setSelectedCurrency}
        onGenerateReport={handleGenerateReport}
        loading={loading}
      />

      {/* Error alert if any */}
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {/* Report table */}
      <ReportTable
        reportData={reportData}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
      />

      {/* Charts section */}
      {reportData && reportData.costs.length > 0 && (
        <Box sx={{ mt: 4 }}>
          {/* Pie chart for category distribution */}
          <Paper elevation={3} className="chart-paper" sx={{ p: 3, mb: 4, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Cost Distribution by Category
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {(() => {
                const pieData = getPieChartData()
                const pieWithColors = pieData.map((d, i) => ({ ...d, color: COLORS[i % COLORS.length] }))
                return <PieChart data={pieWithColors} size={260} currencySymbol={reportCurrencySymbol} />
              })()}
            </Box>
          </Paper>

          {/* Bar chart for monthly trend */}
          <Paper elevation={3} className="chart-paper" sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Monthly Trend for {selectedYear}
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart data={yearlyData} width={800} height={350} currencySymbol={reportCurrencySymbol} />
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  )
}

export default ReportsView
