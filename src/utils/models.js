// Transaction schema designed to be Plaid-compatible for future bank sync
export const createTransaction = ({
  amount,
  type, // 'income' | 'expense'
  categoryId,
  date,
  note = '',
  source = 'manual', // 'manual' | 'imported'
  accountId = null,
  merchantName = null,
  pending = false,
  recurring = false,
}) => ({
  id: crypto.randomUUID(),
  amount: Number(amount),
  type,
  categoryId,
  date,
  note,
  source,
  accountId,
  merchantName,
  pending,
  recurring,
  createdAt: new Date().toISOString(),
})

export const createCategory = ({ name, color, budget = 0, icon = '' }) => ({
  id: crypto.randomUUID(),
  name,
  color,
  budget: Number(budget),
  icon,
})

export const createRecurringExpense = ({ name, amount, frequency, categoryId }) => ({
  id: crypto.randomUUID(),
  name,
  amount: Number(amount),
  frequency, // 'weekly' | 'monthly' | 'yearly'
  categoryId,
  createdAt: new Date().toISOString(),
})
