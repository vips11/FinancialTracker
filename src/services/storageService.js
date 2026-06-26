const KEYS = {
  transactions: 'ft_transactions',
  categories: 'ft_categories',
  recurring: 'ft_recurring',
  settings: 'ft_settings',
  monthlyBudgets: 'ft_monthly_budgets',
}

const get = (key) => JSON.parse(localStorage.getItem(key) || 'null')
const set = (key, data) => localStorage.setItem(key, JSON.stringify(data))

export const storageService = {
  getTransactions: () => get(KEYS.transactions) || [],
  saveTransactions: (data) => set(KEYS.transactions, data),

  getCategories: () => get(KEYS.categories) || [],
  saveCategories: (data) => set(KEYS.categories, data),

  getRecurring: () => get(KEYS.recurring) || [],
  saveRecurring: (data) => set(KEYS.recurring, data),

  getSettings: () => get(KEYS.settings) || { monthlyBudget: 0, theme: 'light' },
  saveSettings: (data) => set(KEYS.settings, data),

  // { "2026-06": { "cat-food": 500, "cat-transport": 200, ... }, ... }
  getMonthlyBudgets: () => get(KEYS.monthlyBudgets) || {},
  saveMonthlyBudgets: (data) => set(KEYS.monthlyBudgets, data),
}
