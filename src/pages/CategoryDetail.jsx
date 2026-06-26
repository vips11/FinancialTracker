import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { formatCurrency, getCurrentMonth, getMonthLabel } from '../utils/helpers'
import { getBudgetStatus } from '../services/budgetService'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import MonthPicker from '../components/MonthPicker'

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function CategoryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useAppContext()
  const [month, setMonth] = useState(getCurrentMonth())
  const [selectedDate, setSelectedDate] = useState(null)
  const [sortKey, setSortKey] = useState('date')
  const [sortDir, setSortDir] = useState('desc')

  const category = state.categories.find((c) => c.id === id)
  if (!category) return <p>Category not found.</p>

  const monthTx = state.transactions.filter((t) => t.type === 'expense' && t.categoryId === id && t.date.startsWith(month))
  const filteredTx = monthTx
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

  const spent = monthTx.reduce((s, t) => s + t.amount, 0)
  const { percent, status } = getBudgetStatus(spent, category.budget)

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }
  const sortIcon = (key) => sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''

  // Chart
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const m = `${month.split('-')[0]}-${String(Number(month.split('-')[1]) + i - 5).padStart(2, '0')}`
    const mNorm = (() => { const d = new Date(Number(month.split('-')[0]), Number(month.split('-')[1]) - 1 + i - 5); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` })()
    const total = state.transactions
      .filter((t) => t.type === 'expense' && t.categoryId === id && t.date.startsWith(mNorm))
      .reduce((s, t) => s + t.amount, 0)
    return { month: monthNames[new Date(Number(mNorm.split('-')[0]), Number(mNorm.split('-')[1]) - 1).getMonth()], Spent: total }
  })

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn btn-outline" onClick={() => navigate(-1)}>← Back</button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 4, height: 24, borderRadius: 2, background: category.color, display: 'inline-block' }} />
            {category.name}
          </h1>
        </div>
      </div>

      <MonthPicker month={month} setMonth={(m) => { setMonth(m); setSelectedDate(null) }} transactions={monthTx} onDateSelect={setSelectedDate} />

      <div className="summary-grid">
        <div className="summary-card expenses">
          <div className="label">Spent</div>
          <div className="value">{formatCurrency(spent)}</div>
        </div>
        <div className="summary-card budget">
          <div className="label">Budget</div>
          <div className="value">{category.budget ? formatCurrency(category.budget) : '—'}</div>
        </div>
        <div className="summary-card balance">
          <div className="label">Remaining</div>
          <div className="value">{category.budget ? formatCurrency(Math.max(category.budget - spent, 0)) : '—'}</div>
        </div>
      </div>

      {category.budget > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
            <span style={{ fontWeight: 600 }}>Budget Usage</span>
            <span style={{ color: 'var(--text-muted)' }}>{formatCurrency(spent)} / {formatCurrency(category.budget)} ({percent.toFixed(0)}%)</span>
          </div>
          <div className="progress-bar" style={{ height: 10 }}>
            <div className="progress-fill" style={{ width: `${percent}%`, background: category.color }} />
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="gradCat" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={category.color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={category.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} tick={{ fill: '#888' }} />
            <YAxis tickLine={false} axisLine={false} fontSize={11} tick={{ fill: '#888' }} tickFormatter={(v) => `$${v}`} />
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Area type="linear" dataKey="Spent" stroke={category.color} strokeWidth={2} fill="url(#gradCat)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => toggleSort('name')}>Name{sortIcon('name')}</th>
              <th className="sortable" onClick={() => toggleSort('date')}>Date{sortIcon('date')}</th>
              <th className="sortable" style={{ textAlign: 'right' }} onClick={() => toggleSort('amount')}>Amount{sortIcon('amount')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredTx.length === 0 && (
              <tr><td colSpan="4" style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>No transactions{selectedDate ? ' on this date' : ' this month'}.</td></tr>
            )}
            {filteredTx.map((t) => (
              <tr key={t.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span className="table-icon" style={{ background: `${category.color}15` }}>📦</span>
                    <span className="table-name">{t.note || 'Expense'}</span>
                  </div>
                </td>
                <td className="table-muted">{formatDate(t.date)}</td>
                <td style={{ textAlign: 'right' }}><span className="table-amount expense">–{formatCurrency(t.amount)}</span></td>
                <td><button className="del-btn always" onClick={() => dispatch({ type: 'DELETE_TRANSACTION', payload: t.id })}>✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
