import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { createRecurringExpense } from '../utils/models'
import { formatCurrency } from '../utils/helpers'

export default function Recurring() {
  const { state, dispatch } = useAppContext()
  const [showForm, setShowForm] = useState(false)
  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [form, setForm] = useState({ name: '', amount: '', frequency: 'monthly', categoryId: '' })

  const getCat = (id) => state.categories.find((c) => c.id === id)
  const catEmojis = { 'Food & Dining': '🛒', 'Transport': '🚗', 'Entertainment': '🎬', 'Utilities': '🏠', 'Shopping': '🛍️', 'Health': '💊' }

  const monthlyTotal = state.recurring.reduce((sum, r) => {
    if (r.frequency === 'monthly') return sum + r.amount
    if (r.frequency === 'weekly') return sum + r.amount * 4.33
    if (r.frequency === 'yearly') return sum + r.amount / 12
    return sum
  }, 0)

  const sorted = [...state.recurring].sort((a, b) => {
    let av, bv
    if (sortKey === 'name') { av = a.name.toLowerCase(); bv = b.name.toLowerCase() }
    else if (sortKey === 'amount') { av = a.amount; bv = b.amount }
    else if (sortKey === 'frequency') { av = a.frequency; bv = b.frequency }
    else if (sortKey === 'category') { av = (getCat(a.categoryId)?.name || 'zzz').toLowerCase(); bv = (getCat(b.categoryId)?.name || 'zzz').toLowerCase() }
    if (av < bv) return sortDir === 'asc' ? -1 : 1
    if (av > bv) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }
  const sortIcon = (key) => sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.amount) return
    dispatch({ type: 'ADD_RECURRING', payload: createRecurringExpense(form) })
    setForm({ name: '', amount: '', frequency: 'monthly', categoryId: '' })
    setShowForm(false)
  }

  return (
    <div>
      <div className="page-header">
        <h1>Subscriptions</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add</button>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="summary-stat">
          <div className="label">Estimated Monthly Total</div>
          <div className="value" style={{ color: 'var(--red)' }}>{formatCurrency(monthlyTotal)}</div>
        </div>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => toggleSort('name')}>Name{sortIcon('name')}</th>
              <th className="sortable" onClick={() => toggleSort('category')}>Category{sortIcon('category')}</th>
              <th className="sortable" onClick={() => toggleSort('frequency')}>Recurrence{sortIcon('frequency')}</th>
              <th className="sortable" style={{ textAlign: 'right' }} onClick={() => toggleSort('amount')}>Amount{sortIcon('amount')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr><td colSpan="5" style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>No subscriptions yet.</td></tr>
            )}
            {sorted.map((r) => {
              const cat = getCat(r.categoryId)
              return (
                <tr key={r.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span className="table-icon" style={{ background: 'var(--purple-light)' }}>{catEmojis[cat?.name] || '📅'}</span>
                      <span className="table-name">{r.name}</span>
                    </div>
                  </td>
                  <td><span className="tx-badge">{cat?.name || '—'}</span></td>
                  <td><span className="tx-badge">{r.frequency.charAt(0).toUpperCase() + r.frequency.slice(1)}</span></td>
                  <td style={{ textAlign: 'right' }}><span className="table-amount expense">{formatCurrency(r.amount)}</span></td>
                  <td><button className="del-btn always" onClick={() => dispatch({ type: 'DELETE_RECURRING', payload: r.id })}>✕</button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add Subscription</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" placeholder="e.g. Netflix, Spotify" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoFocus />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount</label>
                  <input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Recurrence</label>
                  <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                  <option value="">None</option>
                  {state.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
