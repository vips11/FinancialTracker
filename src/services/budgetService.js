// Budget threshold checks — notification-ready
export function getBudgetStatus(spent, budget) {
  if (!budget || budget <= 0) return { percent: 0, status: 'none' }
  const percent = Math.min((spent / budget) * 100, 100)
  let status = 'safe' // green
  if (percent >= 90) status = 'critical' // red
  else if (percent >= 75) status = 'warning' // yellow
  return { percent, status }
}

export function getCategoryBudgetStatuses(transactions, categories, month) {
  return categories.map((cat) => {
    const spent = transactions
      .filter((t) => t.type === 'expense' && t.categoryId === cat.id && t.date.startsWith(month))
      .reduce((sum, t) => sum + t.amount, 0)
    return { ...cat, spent, ...getBudgetStatus(spent, cat.budget) }
  })
}
