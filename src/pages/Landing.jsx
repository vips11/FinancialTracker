import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-logo">💰 FinTrack</div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>Track spending.<br/>Hit goals.<br/><span className="hero-accent">Stay in control.</span></h1>
          <p className="hero-sub">Connect your bank in 10 seconds. Auto-categorize expenses. See where every dollar goes — no spreadsheets needed.</p>
          <div className="hero-ctas">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>Get Started Free</button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/login')}>Sign In</button>
          </div>
          <p className="hero-note">No credit card required • Works offline as guest</p>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <div className="hero-card-row"><span>🛒 Groceries</span><span className="expense">–$84.20</span></div>
            <div className="hero-card-row"><span>🚗 Gas</span><span className="expense">–$45.00</span></div>
            <div className="hero-card-row"><span>💵 Paycheck</span><span className="income">+$3,200.00</span></div>
            <div className="hero-card-row"><span>🎬 Netflix</span><span className="expense">–$15.99</span></div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <div className="feature-icon">🏦</div>
          <h3>Auto Bank Sync</h3>
          <p>Connect via Plaid. Transactions import automatically — no manual entry.</p>
        </div>
        <div className="feature">
          <div className="feature-icon">📊</div>
          <h3>Smart Budgets</h3>
          <p>Set per-category budgets. Get visual alerts before you overspend.</p>
        </div>
        <div className="feature">
          <div className="feature-icon">🔄</div>
          <h3>Recurring Tracking</h3>
          <p>Never forget a subscription. See all recurring charges in one place.</p>
        </div>
      </section>

      <section className="social-proof">
        <p>Join <strong>200+</strong> users tracking <strong>$1.2M</strong> in spending</p>
      </section>

      <footer className="landing-footer">
        <p>Built with ❤️ • <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/dashboard') }}>Try it now</a></p>
      </footer>
    </div>
  )
}
