// Budget threshold checks — notification-ready
export function getBudgetStatus(spent, budget) {
  if (!budget || budget <= 0) return { percent: 0, status: 'none' }
  const percent = Math.min((spent / budget) * 100, 100)
  let status = 'safe' // green
  if (percent >= 90) status = 'critical' // red
  else if (percent >= 75) status = 'warning' // yellow
  return { percent, status }
}

// Get budget for a category in a specific month
// Priority: monthlyBudgets[month][catId] > category.budget (default)
export function getCategoryBudgetForMonth(category, month, monthlyBudgets) {
  if (monthlyBudgets[month] && monthlyBudgets[month][category.id] !== undefined) {
    return monthlyBudgets[month][category.id]
  }
  return category.budget || 0
}

export function getOverallBudgetForMonth(month, monthlyBudgets, settings) {
  if (monthlyBudgets[month] && monthlyBudgets[month].__overall !== undefined) {
    return monthlyBudgets[month].__overall
  }
  return settings.monthlyBudget || 0
}

export function getCategoryBudgetStatuses(transactions, categories, month, monthlyBudgets = {}) {
  return categories.map((cat) => {
    const budget = getCategoryBudgetForMonth(cat, month, monthlyBudgets)
    const spent = transactions
      .filter((t) => t.type === 'expense' && t.categoryId === cat.id && t.date.startsWith(month))
      .reduce((sum, t) => sum + t.amount, 0)
    return { ...cat, spent, budget, ...getBudgetStatus(spent, budget) }
  })
}
