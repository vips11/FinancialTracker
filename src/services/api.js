import { auth } from '../firebase'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function getHeaders() {
  const token = await auth.currentUser?.getIdToken()
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

async function request(path, options = {}) {
  const headers = await getHeaders()
  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  raw: (path, options = {}) => request(path, options),

  getTransactions: () => request('/transactions'),
  addTransaction: (data) => request('/transactions', { method: 'POST', body: JSON.stringify(data) }),
  updateTransaction: (id, data) => request(`/transactions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTransaction: (id) => request(`/transactions/${id}`, { method: 'DELETE' }),

  getCategories: () => request('/categories'),
  addCategory: (data) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id, data) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: 'DELETE' }),

  getRecurring: () => request('/recurring'),
  addRecurring: (data) => request('/recurring', { method: 'POST', body: JSON.stringify(data) }),
  updateRecurring: (id, data) => request(`/recurring/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRecurring: (id) => request(`/recurring/${id}`, { method: 'DELETE' }),

  getSettings: () => request('/settings'),
  updateSettings: (data) => request('/settings', { method: 'PUT', body: JSON.stringify(data) }),
}
