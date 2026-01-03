import { Box, Typography } from '@mui/material'
import { COLORS } from './constants'
import { polarToCartesian, describeSlicePath } from './chartHelpers'

function PieChart({ data = [], size = 200, currencySymbol = '' }) {
  const cx = size / 2
  const cy = size / 2
  const radius = Math.min(cx, cy)
  const total = data.reduce((s, d) => s + d.value, 0)
  // Precompute slice start/end angles to avoid mutating during render
  if (total === 0) {
    return (
      <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={cx} cy={cy} r={radius} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
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
    <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
      <Box>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {slices.map((slice, i) => {
            const path = describeSlicePath(cx, cy, radius, slice.startAngle, slice.endAngle)
            return (
              <g key={slice.name}>
                <path d={path} fill={slice.color || COLORS[i % COLORS.length]} stroke="rgba(15, 23, 42, 0.8)" strokeWidth="2" />
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

export default PieChart
