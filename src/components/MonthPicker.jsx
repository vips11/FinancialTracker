import { getMonthLabel, shiftMonth } from '../utils/helpers'

export default function MonthPicker({ month, setMonth }) {
  // Generate last 12 months as options
  const options = Array.from({ length: 12 }, (_, i) => {
    const m = shiftMonth(month, i - 6)
    return m
  })

  return (
    <div className="month-picker">
      <button className="month-btn" onClick={() => setMonth(shiftMonth(month, -1))}>‹</button>
      <select value={month} onChange={(e) => setMonth(e.target.value)} className="month-select">
        {options.map((m) => <option key={m} value={m}>{getMonthLabel(m)}</option>)}
      </select>
      <button className="month-btn" onClick={() => setMonth(shiftMonth(month, 1))}>›</button>
    </div>
  )
}
