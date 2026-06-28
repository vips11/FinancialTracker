import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
      <div className="card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '400px' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Financial Tracker</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Sign in to manage your finances</p>
        <button className="btn btn-primary" onClick={login} style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem' }}>
          Sign in with Google
        </button>
      </div>
    </div>
  )
}
