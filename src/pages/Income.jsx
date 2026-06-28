import SyncButton from '../components/SyncButton'
import DataRow, { incomeColumns } from '../components/DataRow'
import FormField, { useFormValidation } from '../components/FormField'
import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { createTransaction } from '../utils/models'
import { formatCurrency, getCurrentMonth, getMonthLabel } from '../utils/helpers'
import MonthPicker from '../components/MonthPicker'

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Income() {
  const { state, dispatch } = useAppContext()
  const [showForm, setShowForm] = useState(false)
  const [editingTx, setEditingTx] = useState(null)
  const [month, setMonth] = useState(getCurrentMonth())
  const [selectedDate, setSelectedDate] = useState(null)
  const [sortKey, setSortKey] = useState('date')
  const [sortDir, setSortDir] = useState('desc')
  const [form, setForm] = useState({ amount: '', source: '', date: new Date().toISOString().slice(0, 10) })

  const incomes = state.transactions
    .filter((t) => t.type === 'income' && t.date.startsWith(month))
    .filter((t) => !selectedDate || t.date === selectedDate)
    .sort((a, b) => {
      let av, bv
      if (sortKey === 'date') { av = a.date; bv = b.date }
      else if (sortKey === 'amount') { av = a.amount; bv = b.amount }
      else if (sortKey === 'name') { av = (a.note || '').toLowerCase(); bv = (b.note || '').toLowerCase() }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  const total = incomes.reduce((s, t) => s + t.amount, 0)

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }
  const sortIcon = (key) => sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''

  const { errors, validate, clearErrors } = useFormValidation({
    amount: { required: true, message: 'Amount is required' },
    source: { required: true, message: 'Source is required' },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate(form)) return
    if (editingTx) {
      dispatch({ type: 'UPDATE_TRANSACTION', payload: { _id: editingTx._id || editingTx.id, id: editingTx.id, amount: Number(form.amount), date: form.date, note: form.source } })
      setEditingTx(null)
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload: createTransaction({ amount: form.amount, type: 'income', categoryId: null, date: form.date, note: form.source }) })
    }
    setForm({ amount: '', source: '', date: new Date().toISOString().slice(0, 10) })
    setShowForm(false)
  }

  const startEdit = (t) => {
    setEditingTx(t)
    setForm({ amount: t.amount, source: t.note || '', date: t.date })
    setShowForm(true)
  }

  return (
    <div>
      <div className="page-header">
        <h1>Income</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <SyncButton />
          <button className="btn btn-primary" onClick={() => { setEditingTx(null); setForm({ amount: '', source: '', date: new Date().toISOString().slice(0, 10) }); setShowForm(true) }}>+ Add Income</button>
        </div>
      </div>

      <MonthPicker month={month} setMonth={(m) => { setMonth(m); setSelectedDate(null) }} transactions={state.transactions.filter(t => t.type === 'income' && t.date.startsWith(month))} onDateSelect={setSelectedDate} />

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="summary-stat">
          <div className="label">{selectedDate ? `Total for ${formatDate(selectedDate)}` : `Total for ${getMonthLabel(month)}`}</div>
          <div className="value" style={{ color: 'var(--green)' }}>{formatCurrency(total)}</div>
        </div>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => toggleSort('date')}>Date{sortIcon('date')}</th>
              <th className="sortable" onClick={() => toggleSort('name')}>Source{sortIcon('name')}</th>
              <th className="sortable" style={{ textAlign: 'right' }} onClick={() => toggleSort('amount')}>Amount{sortIcon('amount')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {incomes.length === 0 && (
              <tr><td colSpan="4" style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>No income this month.</td></tr>
            )}
            {incomes.map((t) => (
              <DataRow key={t._id || t.id} item={t} columns={incomeColumns} onEdit={startEdit} onDelete={(id) => dispatch({ type: 'DELETE_TRANSACTION', payload: id })} />
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingTx ? 'Edit Income' : 'Add Income'}</h3>
            <form onSubmit={handleSubmit}>
              <FormField label="Source" error={errors.source}>
                <input type="text" placeholder="e.g. Salary, Freelance" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} autoFocus />
              </FormField>
              <div className="form-row">
                <FormField label="Amount" error={errors.amount}>
                  <input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                </FormField>
                <FormField label="Date">
                  <input type="date" value={form.date} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </FormField>
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
