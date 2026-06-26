import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { formatCurrency, getCurrentMonth, getMonthLabel, shiftMonth } from '../utils/helpers'
import { getBudgetStatus } from '../services/budgetService'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function CategoryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state } = useAppContext()
  const [month, setMonth] = useState(getCurrentMonth())

  const category = state.categories.find((c) => c.id === id)
  if (!category) return <p>Category not found.</p>

  const monthTx = state.transactions.filter((t) => t.type === 'expense' && t.categoryId === id && t.date.startsWith(month))
  const spent = monthTx.reduce((s, t) => s + t.amount, 0)
  const { percent, status } = getBudgetStatus(spent, category.budget)

  // Last 6 months spending for this category
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const m = shiftMonth(month, i - 5)
    const total = state.transactions
      .filter((t) => t.type === 'expense' && t.categoryId === id && t.date.startsWith(m))
      .reduce((s, t) => s + t.amount, 0)
    return { month: monthNames[Number(m.slice(5)) - 1], Spent: total }
  })

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn btn-outline" onClick={() => navigate(-1)}>← Back</button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 14, height: 14, borderRadius: '50%', background: category.color, display: 'inline-block' }} />
            {category.name}
          </h1>
        </div>
      </div>

      <div className="month-switcher">
        <button className="month-btn" onClick={() => setMonth(shiftMonth(month, -1))}>←</button>
        <h2>{getMonthLabel(month)}</h2>
        <button className="month-btn" onClick={() => setMonth(shiftMonth(month, 1))}>→</button>
      </div>

      <div className="summary-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
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
          <div className="budget-item-label">
            <span className="name">Budget Usage</span>
            <span className="amounts">{formatCurrency(spent)} / {formatCurrency(category.budget)} ({percent.toFixed(0)}%)</span>
          </div>
          <div className="progress-bar" style={{ height: 10 }}>
            <div className="progress-fill" style={{ width: `${percent}%`, background: category.color }} />
          </div>
        </div>
      )}

      <div className="card chart-card">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="gradCat" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={category.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={category.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => `$${v}`} />
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Area type="linear" dataKey="Spent" stroke={category.color} strokeWidth={2} fill="url(#gradCat)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem' }}>Transactions</h3>
        <div className="transactions-list">
          {monthTx.length === 0 && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No transactions this month.</p>}
          {monthTx.sort((a, b) => b.date.localeCompare(a.date)).map((t) => (
            <div className="transaction-item" key={t.id}>
              <div className="transaction-dot" style={{ background: category.color }} />
              <div className="transaction-info">
                <div className="name">{t.note || 'Expense'}</div>
                <div className="meta">{t.date}</div>
              </div>
              <div className="transaction-amount expense">-{formatCurrency(t.amount)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
