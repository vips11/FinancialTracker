import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { createTransaction } from '../utils/models'
import { formatCurrency, getCurrentMonth, getMonthLabel } from '../utils/helpers'
import MonthPicker from '../components/MonthPicker'

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Expenses() {
  const { state, dispatch } = useAppContext()
  const [showForm, setShowForm] = useState(false)
  const [editingTx, setEditingTx] = useState(null)
  const [month, setMonth] = useState(getCurrentMonth())
  const [selectedDate, setSelectedDate] = useState(null)
  const [sortKey, setSortKey] = useState('date')
  const [sortDir, setSortDir] = useState('desc')
  const [form, setForm] = useState({ amount: '', categoryId: '', date: new Date().toISOString().slice(0, 10), note: '' })
  const [groupByCategory, setGroupByCategory] = useState(false)

  const getCat = (id) => state.categories.find((c) => c.id === id)
  const catEmojis = { 'Food & Dining': '🛒', 'Transport': '🚗', 'Entertainment': '🎬', 'Utilities': '🏠', 'Shopping': '🛍️', 'Health': '💊' }

  const expenses = state.transactions
    .filter((t) => t.type === 'expense' && t.date.startsWith(month))
    .filter((t) => !selectedDate || t.date === selectedDate)
    .sort((a, b) => {
      let av, bv
      if (sortKey === 'date') { av = a.date; bv = b.date }
      else if (sortKey === 'amount') { av = a.amount; bv = b.amount }
      else if (sortKey === 'name') { av = (a.note || getCat(a.categoryId)?.name || '').toLowerCase(); bv = (b.note || getCat(b.categoryId)?.name || '').toLowerCase() }
      else if (sortKey === 'category') { av = (getCat(a.categoryId)?.name || 'zzz').toLowerCase(); bv = (getCat(b.categoryId)?.name || 'zzz').toLowerCase() }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  const total = expenses.reduce((s, t) => s + t.amount, 0)

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }
  const sortIcon = (key) => sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.amount || !form.categoryId) return
    if (editingTx) {
      dispatch({ type: 'UPDATE_TRANSACTION', payload: { id: editingTx.id, amount: Number(form.amount), categoryId: form.categoryId, date: form.date, note: form.note } })
      setEditingTx(null)
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload: createTransaction({ amount: form.amount, type: 'expense', categoryId: form.categoryId, date: form.date, note: form.note }) })
    }
    setForm({ amount: '', categoryId: '', date: new Date().toISOString().slice(0, 10), note: '' })
    setShowForm(false)
  }

  const startEdit = (t) => {
    setEditingTx(t)
    setForm({ amount: t.amount, categoryId: t.categoryId || '', date: t.date, note: t.note || '' })
    setShowForm(true)
  }

  return (
    <div>
      <div className="page-header">
        <h1>Expenses</h1>
        <button className="btn btn-primary" onClick={() => { setEditingTx(null); setForm({ amount: '', categoryId: '', date: new Date().toISOString().slice(0, 10), note: '' }); setShowForm(true) }}>+ Add Expense</button>
      </div>

      <MonthPicker month={month} setMonth={(m) => { setMonth(m); setSelectedDate(null) }} transactions={state.transactions.filter(t => t.type === 'expense' && t.date.startsWith(month))} onDateSelect={setSelectedDate} />

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="summary-stat">
            <div className="label">{selectedDate ? `Total for ${formatDate(selectedDate)}` : `Total for ${getMonthLabel(month)}`}</div>
            <div className="value" style={{ color: 'var(--red)' }}>{formatCurrency(total)}</div>
          </div>
          <button className="btn btn-outline" onClick={() => setGroupByCategory(!groupByCategory)}>
            {groupByCategory ? 'Show all' : 'Group by category'}
          </button>
        </div>
      </div>

      {groupByCategory ? (
        <div>
          {state.categories.map((cat) => {
            const catTx = expenses.filter((t) => t.categoryId === cat.id)
            if (catTx.length === 0) return null
            const catTotal = catTx.reduce((s, t) => s + t.amount, 0)
            return (
              <div className="card" key={cat.id} style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 4, height: 24, borderRadius: 2, background: cat.color }} />
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{cat.name}</span>
                  </div>
                  <span className="table-amount expense">{formatCurrency(catTotal)}</span>
                </div>
                <table className="data-table">
                  <tbody>
                    {catTx.map((t) => (
                      <tr key={t.id}>
                        <td><span className="table-name">{t.note || 'Expense'}</span></td>
                        <td className="table-muted">{formatDate(t.date)}</td>
                        <td style={{ textAlign: 'right' }}><span className="table-amount expense">–{formatCurrency(t.amount)}</span></td>
                        <td style={{ display: "flex", gap: "0.25rem" }}><button className="del-btn always" onClick={() => startEdit(t)}>✎</button><button className="del-btn always" onClick={() => dispatch({ type: "DELETE_TRANSACTION", payload: t.id })}>✕</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          })}
          {expenses.filter((t) => !state.categories.find((c) => c.id === t.categoryId)).length > 0 && (
            <div className="card" style={{ marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Uncategorized</span>
              <table className="data-table">
                <tbody>
                  {expenses.filter((t) => !state.categories.find((c) => c.id === t.categoryId)).map((t) => (
                    <tr key={t.id}>
                      <td><span className="table-name">{t.note || 'Expense'}</span></td>
                      <td className="table-muted">{formatDate(t.date)}</td>
                      <td style={{ textAlign: 'right' }}><span className="table-amount expense">–{formatCurrency(t.amount)}</span></td>
                      <td style={{ display: "flex", gap: "0.25rem" }}><button className="del-btn always" onClick={() => startEdit(t)}>✎</button><button className="del-btn always" onClick={() => dispatch({ type: "DELETE_TRANSACTION", payload: t.id })}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => toggleSort('name')}>Name{sortIcon('name')}</th>
              <th className="sortable" onClick={() => toggleSort('category')}>Category{sortIcon('category')}</th>
              <th className="sortable" onClick={() => toggleSort('date')}>Date{sortIcon('date')}</th>
              <th className="sortable" style={{ textAlign: 'right' }} onClick={() => toggleSort('amount')}>Amount{sortIcon('amount')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 && (
              <tr><td colSpan="5" style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>No expenses this month.</td></tr>
            )}
            {expenses.map((t) => {
              const cat = getCat(t.categoryId)
              return (
                <tr key={t.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span className="table-icon" style={{ background: 'var(--red-light)' }}>{catEmojis[cat?.name] || '📦'}</span>
                      <span className="table-name">{t.note || cat?.name || 'Expense'}</span>
                    </div>
                  </td>
                  <td><span className="tx-badge">{cat?.name || 'Uncategorized'}</span></td>
                  <td className="table-muted">{formatDate(t.date)}</td>
                  <td style={{ textAlign: 'right' }}><span className="table-amount expense">–{formatCurrency(t.amount)}</span></td>
                  <td style={{ display: "flex", gap: "0.25rem" }}><button className="del-btn always" onClick={() => startEdit(t)}>✎</button><button className="del-btn always" onClick={() => dispatch({ type: "DELETE_TRANSACTION", payload: t.id })}>✕</button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingTx ? 'Edit Expense' : 'Add Expense'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" placeholder="e.g. Lunch at cafe" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} autoFocus />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount</label>
                  <input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
                    <option value="">Select</option>
                    {state.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
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
