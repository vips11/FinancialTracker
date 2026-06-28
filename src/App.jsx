import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import { AlertProvider } from './components/AlertDialog'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Income from './pages/Income'
import Expenses from './pages/Expenses'
import Recurring from './pages/Recurring'
import Categories from './pages/Categories'
import CategoryDetail from './pages/CategoryDetail'
import Login from './pages/Login'
import Landing from './pages/Landing'
import { seedDemoData } from './utils/demoData'

// Seed demo data for first-time guests
if (!localStorage.getItem('ft_transactions') && !localStorage.getItem('ft_seeded')) {
  seedDemoData()
  localStorage.setItem('ft_seeded', '1')
}

function Layout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/recurring" element={<Recurring />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:id" element={<CategoryDetail />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <AppProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/*" element={<Layout />} />
            </Routes>
          </HashRouter>
        </AppProvider>
      </AlertProvider>
    </AuthProvider>
  )
}
