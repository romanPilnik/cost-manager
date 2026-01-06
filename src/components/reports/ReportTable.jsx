import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Divider,
  Box
} from '@mui/material'
import { MONTHS } from '../../config/constants'

// ReportTable
// Displays the detailed list of costs for a selected month and a
// matrix-style table with day, category, description and amounts.
function ReportTable({ reportData, selectedYear, selectedMonth }) {
  // If no data was passed, do not render anything.
  if (!reportData) {
    return null
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      {/* Report title */}
      <Typography variant="h5" gutterBottom>
        Monthly Report - {MONTHS.find((m) => m.value === selectedMonth)?.label} {selectedYear}
      </Typography>

      {reportData.costs.length > 0 ? (
        <>
          {/* Costs table */}
          <TableContainer sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                {/* Column headers */}
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
                  // Cost row: prefer stable `id` for React key, fall back to index.
                  <TableRow key={cost.id ?? index} hover>
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

          {/* Totals summary */}
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
  )
}

export default ReportTable
