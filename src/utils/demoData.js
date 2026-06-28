const today = new Date()
const d = (daysAgo) => {
  const dt = new Date(today)
  dt.setDate(dt.getDate() - daysAgo)
  return dt.toISOString().slice(0, 10)
}
let id = 0
const uid = () => `demo-${++id}`

export const DEMO_CATEGORIES = [
  { id: uid(), name: 'Food & Dining', budget: 500, color: '#f59e0b' },
  { id: uid(), name: 'Transport', budget: 200, color: '#3b82f6' },
  { id: uid(), name: 'Entertainment', budget: 150, color: '#8b5cf6' },
  { id: uid(), name: 'Utilities', budget: 300, color: '#10b981' },
  { id: uid(), name: 'Shopping', budget: 250, color: '#ec4899' },
  { id: uid(), name: 'Health', budget: 100, color: '#ef4444' },
]

const cat = (name) => DEMO_CATEGORIES.find((c) => c.name === name)?.id

export const DEMO_TRANSACTIONS = [
  { id: uid(), type: 'income', amount: 4200, note: 'Salary', date: d(1), categoryId: '' },
  { id: uid(), type: 'income', amount: 850, note: 'Freelance project', date: d(5), categoryId: '' },
  { id: uid(), type: 'expense', amount: 84.2, note: 'Whole Foods groceries', date: d(0), categoryId: cat('Food & Dining') },
  { id: uid(), type: 'expense', amount: 12.5, note: 'Uber to office', date: d(1), categoryId: cat('Transport') },
  { id: uid(), type: 'expense', amount: 45, note: 'Gas station', date: d(2), categoryId: cat('Transport') },
  { id: uid(), type: 'expense', amount: 15.99, note: 'Netflix subscription', date: d(3), categoryId: cat('Entertainment') },
  { id: uid(), type: 'expense', amount: 62, note: 'Electric bill', date: d(4), categoryId: cat('Utilities') },
  { id: uid(), type: 'expense', amount: 38.5, note: 'Dinner at Chipotle', date: d(5), categoryId: cat('Food & Dining') },
  { id: uid(), type: 'expense', amount: 129.99, note: 'New headphones', date: d(6), categoryId: cat('Shopping') },
  { id: uid(), type: 'expense', amount: 25, note: 'Gym membership', date: d(7), categoryId: cat('Health') },
  { id: uid(), type: 'expense', amount: 9.99, note: 'Spotify', date: d(8), categoryId: cat('Entertainment') },
  { id: uid(), type: 'expense', amount: 55, note: 'Internet bill', date: d(10), categoryId: cat('Utilities') },
  { id: uid(), type: 'expense', amount: 22.3, note: 'Trader Joe\'s run', date: d(12), categoryId: cat('Food & Dining') },
  { id: uid(), type: 'income', amount: 200, note: 'Side gig payment', date: d(14), categoryId: '' },
  { id: uid(), type: 'expense', amount: 67, note: 'Target shopping', date: d(15), categoryId: cat('Shopping') },
  { id: uid(), type: 'expense', amount: 18, note: 'Movie tickets', date: d(18), categoryId: cat('Entertainment') },
  { id: uid(), type: 'expense', amount: 42, note: 'Pharmacy', date: d(20), categoryId: cat('Health') },
]

export const DEMO_RECURRING = [
  { id: uid(), name: 'Netflix', amount: 15.99, frequency: 'monthly', categoryId: cat('Entertainment') },
  { id: uid(), name: 'Spotify', amount: 9.99, frequency: 'monthly', categoryId: cat('Entertainment') },
  { id: uid(), name: 'Gym', amount: 25, frequency: 'monthly', categoryId: cat('Health') },
  { id: uid(), name: 'Internet', amount: 55, frequency: 'monthly', categoryId: cat('Utilities') },
  { id: uid(), name: 'Rent', amount: 1800, frequency: 'monthly', categoryId: cat('Utilities') },
]

export function seedDemoData() {
  localStorage.setItem('ft_transactions', JSON.stringify(DEMO_TRANSACTIONS))
  localStorage.setItem('ft_categories', JSON.stringify(DEMO_CATEGORIES))
  localStorage.setItem('ft_recurring', JSON.stringify(DEMO_RECURRING))
  localStorage.setItem('ft_settings', JSON.stringify({ monthlyBudget: 2500, theme: 'light' }))
  localStorage.setItem('ft_monthly_budgets', JSON.stringify({}))
}
