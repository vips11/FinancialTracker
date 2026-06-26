export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(amount)
}

export function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7) // '2026-06'
}

export function getMonthLabel(monthStr) {
  const [y, m] = monthStr.split('-')
  return new Date(y, m - 1).toLocaleString('default', { month: 'long', year: 'numeric' })
}

export function shiftMonth(monthStr, offset) {
  const [y, m] = monthStr.split('-').map(Number)
  const d = new Date(y, m - 1 + offset)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}
