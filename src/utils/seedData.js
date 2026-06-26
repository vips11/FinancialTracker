// Seed data for demo purposes
const CATEGORIES = [
  { id: 'cat-food', name: 'Food & Dining', color: '#f59e0b', budget: 500, icon: '' },
  { id: 'cat-transport', name: 'Transport', color: '#3b82f6', budget: 200, icon: '' },
  { id: 'cat-entertainment', name: 'Entertainment', color: '#7c3aed', budget: 150, icon: '' },
  { id: 'cat-utilities', name: 'Utilities', color: '#0891b2', budget: 300, icon: '' },
  { id: 'cat-shopping', name: 'Shopping', color: '#e11d48', budget: 250, icon: '' },
  { id: 'cat-health', name: 'Health', color: '#10b981', budget: 100, icon: '' },
]

const now = new Date()
const m = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
const prev = (() => { const d = new Date(now.getFullYear(), now.getMonth() - 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` })()
const prev2 = (() => { const d = new Date(now.getFullYear(), now.getMonth() - 2); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` })()

const TRANSACTIONS = [
  // Current month income
  { id: 'tx-1', amount: 5200, type: 'income', categoryId: null, date: `${m}-01`, note: 'Salary', source: 'manual', accountId: null, merchantName: null, pending: false, recurring: false, createdAt: new Date().toISOString() },
  { id: 'tx-2', amount: 800, type: 'income', categoryId: null, date: `${m}-10`, note: 'Freelance project', source: 'manual', accountId: null, merchantName: null, pending: false, recurring: false, createdAt: new Date().toISOString() },
  // Current month expenses
  { id: 'tx-3', amount: 45.50, type: 'expense', categoryId: 'cat-food', date: `${m}-02`, note: 'Groceries', source: 'manual', accountId: null, merchantName: null, pending: false, recurring: false, createdAt: new Date().toISOString() },
  { id: 'tx-4', amount: 32, type: 'expense', categoryId: 'cat-food', date: `${m}-05`, note: 'Sushi dinner', source: 'manual', accountId: null, merchantName: null, pending: false, recurring: false, createdAt: new Date().toISOString() },
  { id: 'tx-5', amount: 85, type: 'expense', categoryId: 'cat-food', date: `${m}-12`, note: 'Uber Eats', source: 'manual', accountId: null, merchantName: null, pending: false, recurring: false, createdAt: new Date().toISOString() },
  { id: 'tx-6', amount: 120, type: 'expense', categoryId: 'cat-transport', date: `${m}-01`, note: 'Presto reload', source: 'manual', accountId: null, merchantName: null, pending: false, recurring: false, createdAt: new Date().toISOString() },
  { id: 'tx-7', amount: 55, type: 'expense', categoryId: 'cat-transport', date: `${m}-14`, note: 'Gas', source: 'manual', accountId: null, merchantName: null, pending: false, recurring: false, createdAt: new Date().toISOString() },
  { id: 'tx-8', amount: 15.99, type: 'expense', categoryId: 'cat-entertainment', date: `${m}-03`, note: 'Netflix', source: 'manual', accountId: null, merchantName: null, pending: false, recurring: false, createdAt: new Date().toISOString() },
  { id: 'tx-9', amount: 22, type: 'expense', categoryId: 'cat-entertainment', date: `${m}-08`, note: 'Movie tickets', source: 'manual', accountId: null, merchantName: null, pending: false, recurring: false, createdAt: new Date().toISOString() },
  { id: 'tx-10', amount: 180, type: 'expense', categoryId: 'cat-utilities', date: `${m}-05`, note: 'Hydro bill', source: 'manual', accountId: null, merchantName: null, pending: false, recurring: false, createdAt: new Date().toISOString() },
  { id: 'tx-11', amount: 65, type: 'expense', categoryId: 'cat-utilities', date: `${m}-05`, note: 'Internet', source: 'manual', accountId: null, merchantName: null, pending: false, recurring: false, createdAt: new Date().toISOString() },
  { id: 'tx-12', amount: 89, type: 'expense', categoryId: 'cat-shopping', date: `${m}-07`, note: 'Amazon order', source: 'manual', accountId: null, merchantName: null, pending: false, recurring: false, createdAt: new Date().toISOString() },
  { id: 'tx-13', amount: 45, type: 'expense', categoryId: 'cat-health', date: `${m}-09`, note: 'Pharmacy', source: 'manual', accountId: null, merchantName: null, pending: false, recurring: false, createdAt: new Date().toISOString() },
  // Previous month
  { id: 'tx-14', amount: 5200, type: 'income', categoryId: null, date: `${prev}-01`, note: 'Salary', source: 'manual', accountId: null, merchantName: null, pending: false, recurring: false, createdAt: new Date().toISOString() },
  { id: 'tx-15', amount: 420, type: 'expense', categoryId: 'cat-food', date: `${prev}-10`, note: 'Groceries & dining', source: 'manual', accountId: null, merchantName: null, pending: false, recurring: false, createdAt: new Date().toISOString() },
  { id: 'tx-16', amount: 150, type: 'expense', categoryId: 'cat-transport', date: `${prev}-05`, note: 'Transit pass', source: 'manual', accountId: null, merchantName: null, pending: false, recurring: false, createdAt: new Date().toISOString() },
  { id: 'tx-17', amount: 250, type: 'expense', categoryId: 'cat-utilities', date: `${prev}-03`, note: 'Bills', source: 'manual', accountId: null, merchantName: null, pending: false, recurring: false, createdAt: new Date().toISOString() },
  { id: 'tx-18', amount: 180, type: 'expense', categoryId: 'cat-shopping', date: `${prev}-15`, note: 'Clothes', source: 'manual', accountId: null, merchantName: null, pending: false, recurring: false, createdAt: new Date().toISOString() },
  { id: 'tx-19', amount: 95, type: 'expense', categoryId: 'cat-entertainment', date: `${prev}-20`, note: 'Concert tickets', source: 'manual', accountId: null, merchantName: null, pending: false, recurring: false, createdAt: new Date().toISOString() },
  // Two months ago
  { id: 'tx-20', amount: 5200, type: 'income', categoryId: null, date: `${prev2}-01`, note: 'Salary', source: 'manual', accountId: null, merchantName: null, pending: false, recurring: false, createdAt: new Date().toISOString() },
  { id: 'tx-21', amount: 600, type: 'income', categoryId: null, date: `${prev2}-15`, note: 'Side project', source: 'manual', accountId: null, merchantName: null, pending: false, recurring: false, createdAt: new Date().toISOString() },
  { id: 'tx-22', amount: 380, type: 'expense', categoryId: 'cat-food', date: `${prev2}-08`, note: 'Groceries', source: 'manual', accountId: null, merchantName: null, pending: false, recurring: false, createdAt: new Date().toISOString() },
  { id: 'tx-23', amount: 200, type: 'expense', categoryId: 'cat-transport', date: `${prev2}-04`, note: 'Uber + gas', source: 'manual', accountId: null, merchantName: null, pending: false, recurring: false, createdAt: new Date().toISOString() },
  { id: 'tx-24', amount: 270, type: 'expense', categoryId: 'cat-utilities', date: `${prev2}-06`, note: 'Bills', source: 'manual', accountId: null, merchantName: null, pending: false, recurring: false, createdAt: new Date().toISOString() },
  { id: 'tx-25', amount: 320, type: 'expense', categoryId: 'cat-shopping', date: `${prev2}-12`, note: 'Electronics', source: 'manual', accountId: null, merchantName: null, pending: false, recurring: false, createdAt: new Date().toISOString() },
]

const RECURRING = [
  { id: 'rec-1', name: 'Netflix', amount: 15.99, frequency: 'monthly', categoryId: 'cat-entertainment', createdAt: new Date().toISOString() },
  { id: 'rec-2', name: 'Spotify', amount: 11.99, frequency: 'monthly', categoryId: 'cat-entertainment', createdAt: new Date().toISOString() },
  { id: 'rec-3', name: 'Rent', amount: 1800, frequency: 'monthly', categoryId: 'cat-utilities', createdAt: new Date().toISOString() },
  { id: 'rec-4', name: 'Phone Plan', amount: 55, frequency: 'monthly', categoryId: 'cat-utilities', createdAt: new Date().toISOString() },
  { id: 'rec-5', name: 'Gym', amount: 49.99, frequency: 'monthly', categoryId: 'cat-health', createdAt: new Date().toISOString() },
  { id: 'rec-6', name: 'Cloud Storage', amount: 2.99, frequency: 'monthly', categoryId: 'cat-utilities', createdAt: new Date().toISOString() },
]

const SETTINGS = { monthlyBudget: 3000, theme: 'light' }

export function seedData() {
  if (!localStorage.getItem('ft_transactions') || JSON.parse(localStorage.getItem('ft_transactions')).length === 0) {
    localStorage.setItem('ft_transactions', JSON.stringify(TRANSACTIONS))
    localStorage.setItem('ft_categories', JSON.stringify(CATEGORIES))
    localStorage.setItem('ft_recurring', JSON.stringify(RECURRING))
    localStorage.setItem('ft_settings', JSON.stringify(SETTINGS))
  }
}
