import { formatCurrency } from '../utils/helpers'

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-CA', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function DataRow({ item, columns, onEdit, onDelete }) {
  return (
    <tr>
      {columns.map((col, i) => (
        <td key={i} style={col.style}>
          {col.render ? col.render(item) : item[col.field] || '—'}
        </td>
      ))}
      <td style={{ textAlign: 'right' }}>
        <span style={{ display: 'inline-flex', gap: '0.25rem' }}>
          {onEdit && <button className="del-btn always" onClick={() => onEdit(item)}>✎</button>}
          {onDelete && <button className="del-btn always" onClick={() => onDelete(item._id || item.id)}>✕</button>}
        </span>
      </td>
    </tr>
  )
}

// Prebuilt column configs
export const txColumns = (getCat) => [
  { field: 'date', render: (t) => formatDate(t.date) },
  { field: 'note', render: (t) => t.note || t.merchantName || '—' },
  { field: 'category', render: (t) => getCat?.(t.categoryId)?.name || '—' },
  { field: 'amount', style: { textAlign: 'right' }, render: (t) => (
    <span style={{ color: t.type === 'income' ? 'var(--green)' : 'var(--red)' }}>
      {formatCurrency(t.amount)}
    </span>
  )},
]

export const incomeColumns = [
  { field: 'date', render: (t) => formatDate(t.date) },
  { field: 'note', render: (t) => t.note || t.merchantName || '—' },
  { field: 'amount', style: { textAlign: 'right' }, render: (t) => (
    <span style={{ color: 'var(--green)' }}>+{formatCurrency(t.amount)}</span>
  )},
]

export const recurringColumns = (getCat) => [
  { field: 'name' },
  { field: 'category', render: (r) => getCat?.(r.categoryId)?.name || '—' },
  { field: 'frequency', render: (r) => r.frequency.charAt(0).toUpperCase() + r.frequency.slice(1) },
  { field: 'amount', style: { textAlign: 'right' }, render: (r) => (
    <span style={{ color: 'var(--red)' }}>{formatCurrency(r.amount)}</span>
  )},
]
