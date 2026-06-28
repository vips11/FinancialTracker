const CURRENCY_LOCALES = { USD: 'en-US', CAD: 'en-CA', INR: 'en-IN' }
let activeCurrency = localStorage.getItem('ft_currency') || 'USD'

export function setCurrency(c) { activeCurrency = c }

export function formatCurrency(amount) {
  return new Intl.NumberFormat(CURRENCY_LOCALES[activeCurrency] || 'en-US', { style: 'currency', currency: activeCurrency }).format(amount)
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
