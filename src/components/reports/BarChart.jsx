import { Box } from '@mui/material'

function BarChart({ data = [], width = 480, height = 220, currencySymbol = '' }) {
  const padding = { top: 20, right: 12, bottom: 36, left: 12 }
  const innerWidth = Math.max(0, width - padding.left - padding.right)
  const innerHeight = Math.max(0, height - padding.top - padding.bottom)
  const maxValue = data.length ? Math.max(...data.map(d => d.total)) : 0
  const barWidth = data.length ? innerWidth / data.length : 0

  return (
    <Box className="bar-chart" sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', maxHeight: '400px' }}>
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
                <text x={x + bw / 2} y={y - 6} textAnchor="middle" fontSize={11} fill="#e2e8f0">{currencySymbol}{d.total.toFixed(0)}</text>
                <text x={x + bw / 2} y={innerHeight + 14} textAnchor="middle" fontSize={12} fill="#94a3b8">{d.month}</text>
              </g>
            )
          })}
          {/* baseline */}
          <line x1={0} y1={innerHeight} x2={innerWidth} y2={innerHeight} stroke="rgba(255,255,255,0.1)" />
        </g>
      </svg>
    </Box>
  )
}

export default BarChart
