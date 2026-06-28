const rules = require('./categorizationRules')

/**
 * Auto-categorize a transaction based on its name/merchant
 * @param {string} name - transaction name or merchant name
 * @param {Array} categories - user's categories from DB
 * @returns {{ categoryId: string|null, recurring: boolean }}
 */
function categorizeTransaction(name, categories) {
  if (!name) return { categoryId: null, recurring: false }
  const lower = name.toLowerCase()

  for (const rule of rules) {
    const match = rule.keywords.some((kw) => lower.includes(kw))
    if (match) {
      const cat = categories.find((c) => c.name.toLowerCase() === rule.category.toLowerCase())
      return { categoryId: cat?._id || cat?.id || null, recurring: rule.recurring }
    }
  }

  return { categoryId: null, recurring: false }
}

module.exports = { categorizeTransaction }
