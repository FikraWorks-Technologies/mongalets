import { useEffect, useMemo, useState } from 'react'
import { Icon, type IconName } from '../components/Icon'
import { Logo } from '../components/Logo'
import { Modal } from '../components/Modal'
import { createDemoSession } from '../lib/session'
import { navigate } from '../lib/router'
import type { Role, Session } from '../lib/types'

const roleOptions: Array<{ role: Role; title: string; subtitle: string; icon: IconName; email: string }> = [
  { role: 'owner', title: 'Owner / Facility', subtitle: 'Properties, units, money and operations', icon: 'building', email: 'owner@mongalets.demo' },
  { role: 'tenant', title: 'Tenant / Resident', subtitle: 'Rent, requests, lease and visitors', icon: 'home', email: 'tenant@mongalets.demo' },
  { role: 'provider', title: 'Service Provider', subtitle: 'Jobs, quotations, schedule and earnings', icon: 'tool', email: 'provider@mongalets.demo' },
  { role: 'guest', title: 'Guest', subtitle: 'Booking, stay details and guest services', icon: 'key', email: 'guest@mongalets.demo' },
  { role: 'admin', title: 'Platform Admin', subtitle: 'Organizations, users and system oversight', icon: 'shield', email: 'admin@mongalets.demo' },
]

export function LoginPage({ initialRole, session }: { initialRole?: Role; session: Session | null }) {
  const [role, setRole] = useState<Role>(initialRole ?? 'owner')
  const selected = useMemo(() => roleOptions.find((item) => item.role === role)!, [role])
  const [email, setEmail] = useState(selected.email)
  const [password, setPassword] = useState('MongaLets@2026')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [otpOpen, setOtpOpen] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)
  
  const [authError, setAuthError] = useState('')

  useEffect(() => { setRole(initialRole ?? 'owner') }, [initialRole])
  useEffect(() => { setEmail(selected.email); setAuthError('') }, [selected.email])

  const signIn = (event: React.FormEvent) => {
    event.preventDefault()
    if (email.trim().toLowerCase() !== selected.email || password !== 'MongaLets@2026') {
      setAuthError('Use the sample email for this role and the demo password MongaLets@2026.')
      return
    }
    setAuthError('')
    setLoading(true)
    window.setTimeout(() => {
      createDemoSession(role, selected.email)
      setLoading(false)
      navigate(`/app/${role}`)
    }, 300)
  }

  const useExisting = () => {
    if (session) navigate(`/app/${session.role}`)
  }

  return (
    <div className="auth-page">
      <aside className="auth-aside">
        <button className="logo-button auth-aside__logo" onClick={() => navigate('/')}><Logo inverse /></button>
        <div className="auth-aside__content">
          <span className="eyebrow eyebrow--light">Welcome to MongaLets</span>
          <h1>One login.<br />A workspace shaped around your role.</h1>
          <p>Owners, tenants, providers and guests see only what they need — while the property stays fully connected.</p>
          <div className="auth-story-card">
            <div className="auth-story-card__image"><img src="/assets/property-city.svg" alt="MongaLets managed property" /></div>
            <div className="auth-story-card__content">
              <div className="auth-story-card__status"><span><Icon name="sync" size={15} /></span> Sample property timeline</div>
              <strong>Marina Bay Apartments</strong>
              <small>Rent, bookings, requests and provider activity in one view.</small>
              <div className="auth-story-card__metrics"><span><b>91%</b> occupancy</span><span><b>94%</b> collected</span><span><b>4</b> active jobs</span></div>
            </div>
          </div>
        </div>
        <div className="auth-aside__footer"><span>Preview role-based workspaces</span><span><Icon name="shield" size={14} /> Demo session only</span></div>
      </aside>

      <main className="auth-main">
        <div className="auth-main__top">
          <button className="text-button" onClick={() => navigate('/')}><Icon name="arrow-right" className="rotate-180" size={16} /> Back to website</button>
          <span>Need help? <button className="text-button text-button--accent" onClick={() => { setForgotOpen(true) }}>Contact support</button></span>
        </div>

        <div className="auth-card">
          {session && (
            <button className="existing-session" onClick={useExisting}>
              <span><Icon name="sync" size={18} /></span>
              <div><strong>Continue your active session</strong><small>{session.name} · {session.role}</small></div>
              <Icon name="arrow-right" size={17} />
            </button>
          )}

          <div className="auth-card__heading">
            <span className="eyebrow">Role-aware access</span>
            <h2>Sign in to your workspace</h2>
            <p>Select how you are entering MongaLets. The interface adapts to the selected sample role. Real authorization is not connected.</p>
          </div>

          <div className="role-selector" role="tablist" aria-label="Choose a role">
            {roleOptions.map((item) => (
              <button
                key={item.role}
                type="button"
                className={role === item.role ? 'is-selected' : ''}
                onClick={() => setRole(item.role)}
                role="tab"
                aria-selected={role === item.role}
              >
                <span><Icon name={item.icon} size={19} /></span>
                <div><strong>{item.title}</strong><small>{item.subtitle}</small></div>
                {role === item.role && <i><Icon name="check" size={12} /></i>}
              </button>
            ))}
          </div>

          <form className="auth-form" onSubmit={signIn}>
            {authError && <p className="form-error" role="alert">{authError}</p>}
            <label>
              <span>Email address</span>
              <div className="input-shell"><Icon name="mail" size={18} /><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></div>
            </label>
            <label>
              <span className="label-row">Password <button type="button" onClick={() => { setForgotOpen(true) }}>Forgot password?</button></span>
              <div className="input-shell"><Icon name="lock" size={18} /><input type={showPassword ? 'text' : 'password'} required value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /><button type="button" className="input-shell__action" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}><Icon name={showPassword ? 'eye-off' : 'eye'} size={18} /></button></div>
            </label>
            <div className="auth-form__options"><label className="checkbox"><input type="checkbox" defaultChecked /><span><Icon name="check" size={12} /></span> Keep me signed in</label><small>Frontend demonstration</small></div>
            <button className="button button--primary button--full button--large" type="submit" disabled={loading}>
              {loading ? <><span className="spinner" /> Preparing your workspace...</> : <>Sign in as {selected.title} <Icon name="arrow-right" size={18} /></>}
            </button>
          </form>

          <div className="auth-divider"><span>or use passwordless access</span></div>
          <button className="button button--secondary button--full" onClick={() => setOtpOpen(true)}><Icon name="phone" size={18} /> About SMS one-time passwords</button>

          <div className="demo-note">
            <span><Icon name="sparkles" size={17} /></span>
            <div><strong>Interactive frontend demonstration</strong><small>Use the sample email and password to preview a role; this does not authenticate against a live server. Production authentication will connect through the application programming interface.</small></div>
          </div>
        </div>
      </main>

      <Modal open={otpOpen} onClose={() => setOtpOpen(false)} title="SMS verification" eyebrow="Production integration" size="small">
        <p>The final MongaLets authentication will require a real phone-number check and a server-verified SMS one-time password. This frontend demo does not send SMS or accept a simulated OTP as proof of identity.</p>
        <button className="button button--primary button--full" onClick={() => setOtpOpen(false)}>Return to demo sign in</button>
      </Modal>

      <Modal open={forgotOpen} onClose={() => setForgotOpen(false)} title="Account recovery" eyebrow="Coming with secure authentication" size="small">
        <p>Password recovery is not available in this frontend-only demo. No email or SMS will be sent. Use the sample login shown on this page to explore the prototype.</p>
        <button className="button button--primary button--full" onClick={() => setForgotOpen(false)}>Return to demo</button>
      </Modal>
    </div>
  )
}
