import { useState } from 'react'
import { api } from '../services/api'
import { useAppContext } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

export default function SyncButton() {
  const { user } = useAuth()
  if (!user) return null
  const [syncing, setSyncing] = useState(false)
  const { dispatch } = useAppContext()

  const handleSync = async () => {
    setSyncing(true)
    try {
      await api.raw('/plaid/sync', { method: 'POST' })
      const transactions = await api.getTransactions()
      if (Array.isArray(transactions)) dispatch({ type: 'SET_DATA', payload: { transactions } })
    } catch (err) {
      console.error('Sync error:', err)
    }
    setSyncing(false)
  }

  return (
    <button className="btn btn-outline" onClick={handleSync} disabled={syncing} style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}>
      {syncing ? '⏳ Syncing...' : '🔄 Sync'}
    </button>
  )
}
