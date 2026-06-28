import { useState } from 'react'

export default function FormField({ label, error, children }) {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      {children}
      {error && <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--red)', marginTop: '0.2rem' }}>{error}</span>}
    </div>
  )
}

export function useFormValidation(rules) {
  const [errors, setErrors] = useState({})

  const validate = (form) => {
    const errs = {}
    for (const [field, { required, message }] of Object.entries(rules)) {
      if (required && !form[field]) errs[field] = message || `${field} is required`
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const clearErrors = () => setErrors({})

  return { errors, validate, clearErrors }
}
