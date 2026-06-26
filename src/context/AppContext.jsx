import { createContext, useContext, useReducer, useEffect } from 'react'
import { storageService } from '../services/storageService'

const AppContext = createContext()

function getInitialState() {
  return {
    transactions: storageService.getTransactions(),
    categories: storageService.getCategories(),
    recurring: storageService.getRecurring(),
    settings: storageService.getSettings(),
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] }
    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter((t) => t.id !== action.payload) }
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
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } }
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

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
