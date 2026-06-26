import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import { getMonthLabel } from '../utils/helpers'

export default function MonthPicker({ month, setMonth, transactions = [], onDateSelect }) {
  const [expanded, setExpanded] = useState(false)
  const [selected, setSelected] = useState(null)

  const [year, mon] = month.split('-').map(Number)
  const displayMonth = new Date(year, mon - 1)
  const txDays = transactions.map((t) => new Date(t.date + 'T00:00:00'))

  const handleDayClick = (day) => {
    if (!day) return
    const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`
    setSelected(day)
    if (onDateSelect) onDateSelect(dateStr)
  }

  const handleMonthChange = (newMonth) => {
    const m = `${newMonth.getFullYear()}-${String(newMonth.getMonth() + 1).padStart(2, '0')}`
    setMonth(m)
    setSelected(null)
    if (onDateSelect) onDateSelect(null)
  }

  const clearFilter = () => {
    setSelected(null)
    if (onDateSelect) onDateSelect(null)
  }

  return (
    <div className="cal-wrapper">
      <button className="cal-toggle" onClick={() => setExpanded(!expanded)}>
        <span className="cal-toggle-icon">📅</span>
        <span className="cal-toggle-label">{selected ? new Date(selected).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : getMonthLabel(month)}</span>
        {selected && <span className="cal-clear" onClick={(e) => { e.stopPropagation(); clearFilter() }}>✕</span>}
        <svg className="cal-chevron" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)' }}>
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>

      {expanded && (
        <div className="cal-body">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleDayClick}
            month={displayMonth}
            onMonthChange={handleMonthChange}
            captionLayout="dropdown"
            startMonth={new Date(2024, 0)}
            endMonth={new Date(2027, 11)}
            modifiers={{ hasTx: txDays }}
            modifiersClassNames={{ hasTx: 'rdp-day--has-tx' }}
          />
        </div>
      )}
    </div>
  )
}
