import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { api } from '../services/api'
import { useAuth } from './AuthContext'

const AppContext = createContext()

const INITIAL_STATE = {
  transactions: [],
  categories: [],
  recurring: [],
  settings: { monthlyBudget: 0, theme: 'light', monthlyBudgets: {} },
  monthlyBudgets: {},
  loaded: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, ...action.payload, loaded: true }
    case 'RESET':
      return { ...INITIAL_STATE }
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] }
    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter((t) => t._id !== action.payload && t.id !== action.payload) }
    case 'UPDATE_TRANSACTION':
      return { ...state, transactions: state.transactions.map((t) => ((t._id || t.id) === (action.payload._id || action.payload.id) ? { ...t, ...action.payload } : t)) }
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] }
    case 'UPDATE_CATEGORY':
      return { ...state, categories: state.categories.map((c) => ((c._id || c.id) === (action.payload._id || action.payload.id) ? { ...c, ...action.payload } : c)) }
    case 'DELETE_CATEGORY':
      return { ...state, categories: state.categories.filter((c) => c._id !== action.payload && c.id !== action.payload) }
    case 'ADD_RECURRING':
      return { ...state, recurring: [...state.recurring, action.payload] }
    case 'DELETE_RECURRING':
      return { ...state, recurring: state.recurring.filter((r) => r._id !== action.payload && r.id !== action.payload) }
    case 'UPDATE_RECURRING':
      return { ...state, recurring: state.recurring.map((r) => ((r._id || r.id) === (action.payload._id || action.payload.id) ? { ...r, ...action.payload } : r)) }
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } }
    case 'SET_MONTHLY_BUDGET': {
      const { month, categoryId, budget } = action.payload
      const mb = { ...state.monthlyBudgets }
      if (!mb[month]) mb[month] = {}
      mb[month][categoryId] = budget
      return { ...state, monthlyBudgets: mb }
    }
    case 'SET_MONTHLY_OVERALL_BUDGET': {
      const mob = { ...state.monthlyBudgets }
      if (!mob[action.payload.month]) mob[action.payload.month] = {}
      mob[action.payload.month].__overall = action.payload.budget
      return { ...state, monthlyBudgets: mob }
    }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, rawDispatch] = useReducer(reducer, INITIAL_STATE)
  const { user } = useAuth()

  // Load data from API (logged in) or localStorage (guest)
  useEffect(() => {
    rawDispatch({ type: 'RESET' })
    if (user) {
      Promise.all([api.getTransactions(), api.getCategories(), api.getRecurring(), api.getSettings()])
        .then(([transactions, categories, recurring, settings]) => {
          rawDispatch({ type: 'SET_DATA', payload: {
            transactions: Array.isArray(transactions) ? transactions : [],
            categories: Array.isArray(categories) ? categories : [],
            recurring: Array.isArray(recurring) ? recurring : [],
            settings: settings && !settings.error ? settings : { monthlyBudget: 0, theme: 'light' },
            monthlyBudgets: settings?.monthlyBudgets || {},
          }})
        })
        .catch((err) => {
          console.error('Failed to load data:', err)
          rawDispatch({ type: 'SET_DATA', payload: { ...INITIAL_STATE, loaded: true } })
        })
    } else {
      // Guest mode — use localStorage
      const get = (k) => JSON.parse(localStorage.getItem(k) || 'null')
      rawDispatch({ type: 'SET_DATA', payload: {
        transactions: get('ft_transactions') || [],
        categories: get('ft_categories') || [],
        recurring: get('ft_recurring') || [],
        settings: get('ft_settings') || { monthlyBudget: 0, theme: 'light' },
        monthlyBudgets: get('ft_monthly_budgets') || {},
      }})
    }
  }, [user])

  // Dispatch wrapper that syncs to API or localStorage
  const dispatch = useCallback((action) => {
    rawDispatch(action)
    if (!user) {
      // Guest mode — save to localStorage after state update
      setTimeout(() => {
        const el = document.getElementById('root')
        // We'll handle localStorage persistence in a useEffect below
      }, 0)
      return
    }
    switch (action.type) {
      case 'ADD_TRANSACTION':
        api.addTransaction(action.payload).then((t) => { if (t?._id) rawDispatch({ type: 'UPDATE_TRANSACTION', payload: t }) })
        break
      case 'DELETE_TRANSACTION':
        api.deleteTransaction(action.payload)
        break
      case 'UPDATE_TRANSACTION':
        api.updateTransaction(action.payload._id || action.payload.id, action.payload)
        break
      case 'ADD_CATEGORY':
        api.addCategory(action.payload).then((c) => { if (c?._id) rawDispatch({ type: 'UPDATE_CATEGORY', payload: c }) })
        break
      case 'UPDATE_CATEGORY':
        api.updateCategory(action.payload._id || action.payload.id, action.payload)
        break
      case 'DELETE_CATEGORY':
        api.deleteCategory(action.payload)
        break
      case 'ADD_RECURRING':
        api.addRecurring(action.payload).then((r) => { if (r?._id) rawDispatch({ type: 'UPDATE_RECURRING', payload: r }) })
        break
      case 'UPDATE_RECURRING':
        api.updateRecurring(action.payload._id || action.payload.id, action.payload)
        break
      case 'DELETE_RECURRING':
        api.deleteRecurring(action.payload)
        break
      case 'UPDATE_SETTINGS':
      case 'SET_MONTHLY_BUDGET':
      case 'SET_MONTHLY_OVERALL_BUDGET': {
        // Defer settings save to after state update
        setTimeout(() => {
          const s = document.querySelector('[data-settings-sync]')
          if (s) s.click()
        }, 0)
        break
      }
    }
  }, [])

  // Settings sync for logged-in users
  useEffect(() => {
    if (!state.loaded || !user) return
    api.updateSettings({ monthlyBudget: state.settings.monthlyBudget, theme: state.settings.theme, monthlyBudgets: state.monthlyBudgets })
  }, [state.settings.monthlyBudget, state.settings.theme, state.monthlyBudgets, state.loaded])

  // localStorage persistence for guest mode only
  useEffect(() => {
    if (!state.loaded || user) return
    // Only save if there's actual data (don't overwrite with empty on logout)
    if (state.transactions.length || state.categories.length || state.recurring.length) {
      localStorage.setItem('ft_transactions', JSON.stringify(state.transactions))
      localStorage.setItem('ft_categories', JSON.stringify(state.categories))
      localStorage.setItem('ft_recurring', JSON.stringify(state.recurring))
      localStorage.setItem('ft_settings', JSON.stringify(state.settings))
      localStorage.setItem('ft_monthly_budgets', JSON.stringify(state.monthlyBudgets))
    }
  }, [state.transactions, state.categories, state.recurring, state.settings, state.monthlyBudgets, state.loaded, user])

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.settings.theme)
  }, [state.settings.theme])

  if (!state.loaded) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
