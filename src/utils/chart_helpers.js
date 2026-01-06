// chartHelpers.js
// Small utility helpers for converting polar coordinates and
// building SVG path strings for pie chart slices. These helpers
// are intentionally minimal and pure (no side-effects).

// Convert polar coordinates (radius, angle) -> cartesian (x,y).
// Input angles are in degrees. Output is an object with x,y.
export function polarToCartesian(cx, cy, radius, angleInDegrees) {
  // Convert degrees to radians and offset by -90deg so 0deg is at 12 o'clock
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians)
  }
}

// Build an SVG path string that draws a pie slice between two angles.
// Handles the special-case of a full circle by emitting two arcs.
export function describeSlicePath(cx, cy, radius, startAngle, endAngle) {
  // If the slice spans the full circle, draw a full circle path.
  if (endAngle - startAngle >= 360) {
    return `M ${cx} ${cy} m -${radius}, 0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`
  }

  // Compute start/end points on the circle for the slice.
  const start = polarToCartesian(cx, cy, radius, endAngle)
  const end = polarToCartesian(cx, cy, radius, startAngle)

  // large-arc-flag follows SVG arc rules: set to 1 when > 180deg
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

  // Return a closed path that starts at the center, goes to the start
  // point, draws an arc to the end point, then closes the slice.
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`
}
