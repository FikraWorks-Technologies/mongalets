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
  const [forgotSent, setForgotSent] = useState(false)

  useEffect(() => {
    setEmail(selected.email)
  }, [selected.email])

  const signIn = (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    window.setTimeout(() => {
      createDemoSession(role, email)
      setLoading(false)
      navigate(`/app/${role}`)
    }, 650)
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
              <div className="auth-story-card__status"><span><Icon name="sync" size={15} /></span> Live property timeline</div>
              <strong>Marina Bay Apartments</strong>
              <small>Rent, bookings, requests and provider activity in one view.</small>
              <div className="auth-story-card__metrics"><span><b>91%</b> occupancy</span><span><b>94%</b> collected</span><span><b>4</b> active jobs</span></div>
            </div>
          </div>
        </div>
        <div className="auth-aside__footer"><span>Secure role-based access</span><span><Icon name="shield" size={14} /> Protected sessions</span></div>
      </aside>

      <main className="auth-main">
        <div className="auth-main__top">
          <button className="text-button" onClick={() => navigate('/')}><Icon name="arrow-right" className="rotate-180" size={16} /> Back to website</button>
          <span>Need help? <button className="text-button text-button--accent" onClick={() => { setForgotSent(false); setForgotOpen(true) }}>Contact support</button></span>
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
            <p>Select how you are entering MongaLets. Your navigation, actions and data permissions will adapt automatically.</p>
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
            <label>
              <span>Email address</span>
              <div className="input-shell"><Icon name="mail" size={18} /><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></div>
            </label>
            <label>
              <span className="label-row">Password <button type="button" onClick={() => { setForgotSent(false); setForgotOpen(true) }}>Forgot password?</button></span>
              <div className="input-shell"><Icon name="lock" size={18} /><input type={showPassword ? 'text' : 'password'} required value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /><button type="button" className="input-shell__action" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}><Icon name={showPassword ? 'eye-off' : 'eye'} size={18} /></button></div>
            </label>
            <div className="auth-form__options"><label className="checkbox"><input type="checkbox" defaultChecked /><span><Icon name="check" size={12} /></span> Keep me signed in</label><small>Protected with secure sessions</small></div>
            <button className="button button--primary button--full button--large" type="submit" disabled={loading}>
              {loading ? <><span className="spinner" /> Preparing your workspace...</> : <>Sign in as {selected.title} <Icon name="arrow-right" size={18} /></>}
            </button>
          </form>

          <div className="auth-divider"><span>or use passwordless access</span></div>
          <button className="button button--secondary button--full" onClick={() => setOtpOpen(true)}><Icon name="phone" size={18} /> Send one-time password by SMS</button>

          <div className="demo-note">
            <span><Icon name="sparkles" size={17} /></span>
            <div><strong>Interactive frontend demonstration</strong><small>Any email and password will open the selected role. Production authentication will connect through the application programming interface.</small></div>
          </div>
        </div>
      </main>

      <Modal open={otpOpen} onClose={() => setOtpOpen(false)} title="Sign in with a one-time password" eyebrow="FikraWorks BulkSMS" size="small">
        <form className="otp-form" onSubmit={(event) => { event.preventDefault(); setOtpOpen(false); createDemoSession(role, email); navigate(`/app/${role}`) }}>
          <p>Enter the mobile number linked to your {selected.title.toLowerCase()} account.</p>
          <label>Mobile number<div className="input-shell"><Icon name="phone" size={18} /><input required defaultValue="+254 769 778 549" /></div></label>
          <div className="otp-preview"><Icon name="message" size={18} /><div><strong>Secure six-digit code</strong><small>The production version will send and verify this through FikraWorks BulkSMS.</small></div></div>
          <button className="button button--primary button--full" type="submit">Send code and continue <Icon name="arrow-right" size={17} /></button>
        </form>
      </Modal>

      <Modal open={forgotOpen} onClose={() => setForgotOpen(false)} title={forgotSent ? 'Check your email' : 'Recover your account'} eyebrow="Secure access" size="small">
        {forgotSent ? (
          <div className="success-state"><span><Icon name="mail" size={28} /></span><h3>Recovery instructions sent.</h3><p>In production, a secure recovery link and SMS alert will be issued to the account holder.</p><button className="button button--primary button--full" onClick={() => setForgotOpen(false)}>Return to login</button></div>
        ) : (
          <form className="contact-form" onSubmit={(event) => { event.preventDefault(); setForgotSent(true) }}><label>Account email<input type="email" required defaultValue={email} /></label><button className="button button--primary button--full" type="submit">Send recovery instructions <Icon name="arrow-right" size={17} /></button></form>
        )}
      </Modal>
    </div>
  )
}
