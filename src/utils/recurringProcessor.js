import { getCurrentMonth } from './helpers'

// Generate transactions from recurring items that are due
export function processRecurring(recurring, existingTransactions) {
  const today = new Date().toISOString().slice(0, 10)
  const month = getCurrentMonth()
  const newTx = []

  recurring.forEach((r) => {
    // Check if a transaction already exists for this recurring item this month
    const alreadyExists = existingTransactions.some(
      (t) => t.recurringId === (r._id || r.id) && t.date.startsWith(month)
    )
    if (alreadyExists) return

    const tx = {
      id: `rec-${r._id || r.id}-${month}`,
      type: 'expense',
      amount: r.amount,
      note: r.name,
      categoryId: r.categoryId || 'uncategorized',
      date: `${month}-01` <= today ? `${month}-01` : today,
      recurringId: r._id || r.id,
      auto: true,
    }
    newTx.push(tx)
  })

  return newTx
}
