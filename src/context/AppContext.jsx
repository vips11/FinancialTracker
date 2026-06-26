import { createContext, useContext, useReducer, useEffect } from 'react'
import { storageService } from '../services/storageService'

const AppContext = createContext()

function getInitialState() {
  return {
    transactions: storageService.getTransactions(),
    categories: storageService.getCategories(),
    recurring: storageService.getRecurring(),
    settings: storageService.getSettings(),
    monthlyBudgets: storageService.getMonthlyBudgets(),
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] }
    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter((t) => t.id !== action.payload) }
    case 'UPDATE_TRANSACTION':
      return { ...state, transactions: state.transactions.map((t) => (t.id === action.payload.id ? { ...t, ...action.payload } : t)) }
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] }
    case 'UPDATE_CATEGORY':
      return { ...state, categories: state.categories.map((c) => (c.id === action.payload.id ? action.payload : c)) }
    case 'DELETE_CATEGORY':
      return { ...state, categories: state.categories.filter((c) => c.id !== action.payload) }
    case 'ADD_RECURRING':
      return { ...state, recurring: [...state.recurring, action.payload] }
    case 'DELETE_RECURRING':
      return { ...state, recurring: state.recurring.filter((r) => r.id !== action.payload) }
    case 'UPDATE_RECURRING':
      return { ...state, recurring: state.recurring.map((r) => (r.id === action.payload.id ? { ...r, ...action.payload } : r)) }
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } }
    case 'SET_MONTHLY_BUDGET':
      // payload: { month: '2026-06', categoryId: 'cat-food', budget: 500 }
      const { month: bMonth, categoryId: bCat, budget: bVal } = action.payload
      const mb = { ...state.monthlyBudgets }
      if (!mb[bMonth]) mb[bMonth] = {}
      mb[bMonth][bCat] = bVal
      return { ...state, monthlyBudgets: mb }
    case 'SET_MONTHLY_OVERALL_BUDGET':
      // payload: { month: '2026-06', budget: 3000 }
      const mob = { ...state.monthlyBudgets }
      if (!mob[action.payload.month]) mob[action.payload.month] = {}
      mob[action.payload.month].__overall = action.payload.budget
      return { ...state, monthlyBudgets: mob }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, getInitialState)

  useEffect(() => { storageService.saveTransactions(state.transactions) }, [state.transactions])
  useEffect(() => { storageService.saveCategories(state.categories) }, [state.categories])
  useEffect(() => { storageService.saveRecurring(state.recurring) }, [state.recurring])
  useEffect(() => { storageService.saveSettings(state.settings) }, [state.settings])
  useEffect(() => { storageService.saveMonthlyBudgets(state.monthlyBudgets) }, [state.monthlyBudgets])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
