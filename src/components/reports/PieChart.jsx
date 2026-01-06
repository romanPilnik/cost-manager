import { Box, Typography } from '@mui/material'
import { COLORS } from '../../config/constants'
import { describeSlicePath } from '../../utils/chart_helpers'

// PieChart component
// Displays a pie chart built from plain SVG paths. Expects `data` to be
// an array of { name, value, color? } entries. Currency symbol is used
// for monetary labels beside each legend entry.
function PieChart({ data = [], size = 200, currencySymbol = '' }) {
  // Circle center coordinates and radius for drawing.
  const cx = size / 2
  const cy = size / 2
  const radius = Math.min(cx, cy)

  // Total value is used to compute slice proportions; guard zero-case.
  const total = data.reduce((s, d) => s + d.value, 0)

  // If there is no data (or all zeros), render an empty circle + legend.
  if (total === 0) {
    return (
      <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
        {/* Empty-pie graphic area (no values to display) */}
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={cx} cy={cy} r={radius} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
        </svg>
        <Box>
          {/* Legend for categories (shows name, amount, percentage) */}
          {data.map((slice, i) => (
            <Box key={slice.name} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {/* color swatch */}
              <Box sx={{ width: 12, height: 12, backgroundColor: slice.color || COLORS[i % COLORS.length], borderRadius: '2px' }} />
              {/* category name */}
              <Typography variant="body2" sx={{ minWidth: 120 }}>{slice.name}</Typography>
              {/* value label */}
              <Typography variant="body2" fontWeight="bold">{currencySymbol}{slice.value.toFixed(2)}</Typography>
              {/* percentage (zero-case) */}
              <Typography variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>(0%)</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    )
  }

  // Build slice metadata with start/end angles. Uses a cumulative sum.
  const slices = []
  let cum = 0
  for (let i = 0; i < data.length; i++) {
    const slice = data[i]
    const start = cum
    cum += slice.value
    const end = cum
    slices.push({ ...slice, startAngle: (start / total) * 360, endAngle: (end / total) * 360 })
  }

  // Render pie and legend side-by-side.
  return (
    <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
      <Box>
        {/* SVG canvas containing pie slice paths */}
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {slices.map((slice, i) => {
            // Describe the slice as an SVG path string using helper.
            const path = describeSlicePath(cx, cy, radius, slice.startAngle, slice.endAngle)
            return (
              <g key={slice.name}>
                {/* slice path */}
                <path d={path} fill={slice.color || COLORS[i % COLORS.length]} stroke="rgba(15, 23, 42, 0.8)" strokeWidth="2" />
              </g>
            )
          })}
        </svg>
      </Box>
      <Box>
        {/* Legend listing with amounts and percentages */}
        {slices.map((slice, i) => (
          <Box key={slice.name} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            {/* color swatch for slice */}
            <Box sx={{ width: 12, height: 12, backgroundColor: slice.color || COLORS[i % COLORS.length], borderRadius: '2px' }} />
            {/* category label */}
            <Typography variant="body2" sx={{ minWidth: 120 }}>{slice.name}</Typography>
            {/* value label */}
            <Typography variant="body2" fontWeight="bold">{currencySymbol}{slice.value.toFixed(2)}</Typography>
            {/* percentage label */}
            <Typography variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>({((slice.value / total) * 100).toFixed(1)}%)</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default PieChart
