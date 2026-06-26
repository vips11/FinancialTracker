import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { createCategory } from '../utils/models'
import { formatCurrency, getCurrentMonth } from '../utils/helpers'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#7b61ff', '#5b8def', '#2d9f5f', '#d94452', '#e5a52e', '#00b8d9', '#e84393', '#a29bfe', '#2ed573', '#ffc048']

export default function Categories() {
  const { state, dispatch } = useAppContext()
  const [showForm, setShowForm] = useState(false)
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [budgetValue, setBudgetValue] = useState('')
  const [form, setForm] = useState({ name: '', color: COLORS[0], budget: '' })
  const [editBudget, setEditBudget] = useState(null)

  const month = getCurrentMonth()

  const pieData = state.categories.map((cat) => {
    const spent = state.transactions
      .filter((t) => t.type === 'expense' && t.categoryId === cat.id && t.date.startsWith(month))
      .reduce((s, t) => s + t.amount, 0)
    return { name: cat.name, value: spent, color: cat.color }
  }).filter((d) => d.value > 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name) return
    dispatch({ type: 'ADD_CATEGORY', payload: createCategory(form) })
    setForm({ name: '', color: COLORS[0], budget: '' })
    setShowForm(false)
  }

  const handleBudgetSave = (cat) => {
    dispatch({ type: 'UPDATE_CATEGORY', payload: { ...cat, budget: Number(editBudget.value) } })
    setEditBudget(null)
  }

  const handleOverallBudgetSave = (e) => {
    e.preventDefault()
    dispatch({ type: 'UPDATE_SETTINGS', payload: { monthlyBudget: Number(budgetValue) } })
    setShowBudgetModal(false)
  }

  return (
    <div>
      <div className="page-header">
        <h1>Spending Plan</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Category</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card">
          <div className="card-header">
            <h3>Spending Breakdown</h3>
          </div>
          {pieData.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No spending data this month.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.72rem' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Monthly Budget</h3>
            <button className="btn btn-outline" style={{ fontSize: '0.7rem', padding: '0.3rem 0.7rem' }} onClick={() => { setBudgetValue(state.settings.monthlyBudget || ''); setShowBudgetModal(true) }}>
              {state.settings.monthlyBudget ? 'Change' : 'Set Budget'}
            </button>
          </div>
          {state.settings.monthlyBudget > 0 ? (
            <div className="summary-stat">
              <div className="label">Overall Budget</div>
              <div className="value" style={{ color: 'var(--orange)' }}>{formatCurrency(state.settings.monthlyBudget)}</div>
            </div>
          ) : (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No budget set. Click "Set Budget" to add one.</p>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>All Categories</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Category</th>
              <th style={{ textAlign: 'right' }}>Budget</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {state.categories.length === 0 && (
              <tr><td colSpan="3" style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>No categories yet.</td></tr>
            )}
            {state.categories.map((cat) => (
              <tr key={cat.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 4, height: 28, borderRadius: 2, background: cat.color }} />
                    <span className="table-name">{cat.name}</span>
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {editBudget !== null && editBudget.id === cat.id ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleBudgetSave(cat) }} style={{ display: 'inline-flex', gap: '0.3rem' }}>
                      <input type="number" style={{ width: 80, padding: '0.3rem 0.5rem', borderRadius: 6, border: '1px solid var(--border)', fontSize: '0.8rem', background: 'var(--bg)', color: 'var(--text)' }} value={editBudget.value} onChange={(e) => setEditBudget({ ...editBudget, value: e.target.value })} autoFocus />
                      <button type="submit" className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem' }}>Save</button>
                    </form>
                  ) : (
                    <button className="btn btn-outline" style={{ fontSize: '0.7rem', padding: '0.3rem 0.7rem' }} onClick={() => setEditBudget({ id: cat.id, value: cat.budget || '' })}>
                      {cat.budget ? formatCurrency(cat.budget) : 'Set'}
                    </button>
                  )}
                </td>
                <td><button className="del-btn always" onClick={() => dispatch({ type: 'DELETE_CATEGORY', payload: cat.id })}>✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Category Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add Category</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" placeholder="e.g. Food, Transport" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoFocus />
              </div>
              <div className="form-group">
                <label>Color</label>
                <div className="color-options">
                  {COLORS.map((c) => (
                    <div key={c} className={`color-swatch ${form.color === c ? 'selected' : ''}`} style={{ background: c }} onClick={() => setForm({ ...form, color: c })} />
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Monthly Budget (optional)</label>
                <input type="number" step="1" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="0" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Overall Budget Modal */}
      {showBudgetModal && (
        <div className="modal-overlay" onClick={() => setShowBudgetModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Set Monthly Budget</h3>
            <form onSubmit={handleOverallBudgetSave}>
              <div className="form-group">
                <label>Amount</label>
                <input type="number" step="1" value={budgetValue} onChange={(e) => setBudgetValue(e.target.value)} placeholder="e.g. 3000" required autoFocus />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowBudgetModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
