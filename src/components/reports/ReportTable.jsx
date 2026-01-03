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
import { MONTHS } from './constants'

function ReportTable({ reportData, selectedYear, selectedMonth }) {
  if (!reportData) {
    return null
  }

  return (
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
  )
}

export default ReportTable
