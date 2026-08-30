import { useMemo, useState } from 'react'
import { Icon } from '../components/Icon'
import { Logo } from '../components/Logo'
import { clearSession } from '../lib/session'
import { navigate } from '../lib/router'
import type { Role, Session } from '../lib/types'

type Presence = { name: string; unit: string; status: 'Inside' | 'Expected' | 'Left'; time: string; kind: 'resident' | 'guest' | 'provider' }

const presence: Presence[] = [
  { name: 'Amina Njoki', unit: 'A-204', status: 'Inside', time: '10:42 AM', kind: 'resident' },
  { name: 'David Otieno', unit: 'B-112', status: 'Inside', time: '09:18 AM', kind: 'resident' },
  { name: 'Grace W.', unit: 'C-301', status: 'Expected', time: '2:30 PM', kind: 'guest' },
  { name: 'DenzeK Services', unit: 'Service visit · A-204', status: 'Expected', time: '4:00 PM', kind: 'provider' },
]

const serviceCards = [
  { title: 'Electrical & repairs', text: 'Electricians, plumbers, carpenters and appliance technicians.', image: 'https://cdn.prod.website-files.com/68d11b2c43a7b995a2a94b39/68d2441cc89ec3d7c323124a_Fixing-Your-Lights_-Why-Professional-Electrical-Repair-Ensures-Safety-and-Longevity-in-SA-%28s%29.webp' },
  { title: 'Cleaning', text: 'Home cleaning, deep cleaning, laundry and pest-control support.', image: 'https://images.squarespace-cdn.com/content/v1/6821ff6bfbba143e4bdce485/ad485361-2bf8-4b69-93a2-f0f3dc60616e/%C3%87.jpg' },
  { title: 'Transport & cabs', text: 'Cabs, airport transfers, drivers and vehicle hire when you need them.', image: 'https://sote.africa/assets/images/resources/sote-taxi-nairobi.png' },
]

const propertyImage = 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/766045989.webp?k=69c9ccd01371216f3753872bf2418c61d777434bd5a8edd511d5f39f9955dfe7&o='

export function SecurityPortalPage({ role, section, session }: { role: Role; section?: string; session: Session }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const initials = useMemo(() => session.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase(), [session.name])

  const roleName = role === 'owner' ? 'Management' : role === 'admin' ? 'Security admin' : role === 'provider' ? 'Service provider' : role === 'guest' ? 'Guest' : 'Resident'
  const nav = role === 'owner' || role === 'admin'
    ? [
        ['grid', 'Overview'], ['shield', 'Security'], ['users', 'People & presence'], ['key', 'Visitor access'], ['tool', 'Requests'], ['briefcase', 'Service providers'], ['calendar', 'Calendar'],
      ]
    : role === 'provider'
      ? [['grid', 'Overview'], ['briefcase', 'My services'], ['calendar', 'Schedule'], ['key', 'Access visits'], ['tool', 'Jobs']]
      : [['grid', 'Home'], ['key', 'Visitors'], ['tool', 'My reports'], ['briefcase', 'Services'], ['calendar', 'Calendar']]

  const active = section ? nav.find(([, label]) => label.toLowerCase().replace(/[^a-z0-9]+/g, '-') === section)?.[1] : nav[0][1]
  const activeLabel = active ?? nav[0][1]
  const isHome = activeLabel === nav[0][1]

  const logout = () => { clearSession(); navigate('/login') }

  return (
    <div className="security-portal-shell">
      <aside className={`security-portal-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="security-sidebar-top"><button className="logo-button" onClick={() => navigate('/')}><Logo inverse /></button><button className="icon-button security-mobile-close" onClick={() => setSidebarOpen(false)}><Icon name="close" /></button></div>
        <div className="security-workspace"><span><Icon name={role === 'owner' || role === 'admin' ? 'shield' : role === 'provider' ? 'tool' : 'home'} size={18} /></span><div><small>Current workspace</small><strong>{roleName}</strong></div></div>
        <nav className="security-nav"><small>Workspace</small>{nav.map(([icon, label], index) => <button key={label} className={activeLabel === label ? 'is-active' : ''} onClick={() => { navigate(index === 0 ? `/app/${role}` : `/app/${role}/${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`); setSidebarOpen(false) }}><Icon name={icon as any} size={18} /><span>{label}</span>{label === 'Requests' || label === 'My reports' ? <b>2</b> : null}</button>)}</nav>
        <div className="security-sidebar-footer"><button onClick={() => navigate('/login')}><Icon name="users" size={17} /> Switch role</button><button onClick={logout}><Icon name="logout" size={17} /> Sign out</button><div className="security-user"><span>{initials}</span><section><strong>{session.name}</strong><small>{session.email}</small></section><Icon name="settings" size={15} /></div></div>
      </aside>

      <div className="security-portal-main">
        <header className="security-topbar"><div className="security-topbar-left"><button className="icon-button security-menu" onClick={() => setSidebarOpen(true)}><Icon name="menu" /></button><div className="security-breadcrumb"><span>MongaLets</span><Icon name="arrow-right" size={13} /><strong>{activeLabel}</strong></div></div><div className="security-top-actions"><button className="security-search"><Icon name="search" size={16} /><span>Search people, visitors, requests...</span></button><button className="icon-button icon-button--bordered" onClick={() => setNotificationsOpen(true)}><Icon name="bell" size={18} /><i /></button><button className="button button--primary button--small" onClick={() => role === 'tenant' ? setInviteOpen(true) : setReportOpen(true)}><Icon name="plus" size={16} /> Quick action</button><button className="portal-avatar">{initials}</button></div></header>

        <main className="security-portal-content">
          {isHome ? <>
            <section className="security-dashboard-heading"><div><span className="eyebrow">{roleName} · {role === 'tenant' ? 'Marina Bay · A5G' : 'Building security'}</span><h1>{role === 'tenant' ? 'Welcome home, Amina' : role === 'provider' ? 'Your service workspace' : 'Security command centre'}</h1><p>{role === 'tenant' ? 'Everything you need for access, reports and trusted services — without the clutter.' : 'A clear view of who is inside, who is expected, and what needs attention.'}</p></div><div className="security-heading-actions"><button className="button button--secondary" onClick={() => navigate(`/app/${role}/calendar`)}><Icon name="calendar" size={16} /> Calendar</button><button className="button button--primary" onClick={() => setInviteOpen(true)}><Icon name="key" size={16} /> Invite visitor</button></div></section>

            <section className="security-metric-grid"><article><span><Icon name="users" size={19} /></span><small>Inside now</small><strong>42</strong><p>Residents, guests & staff</p></article><article><span><Icon name="clock" size={19} /></span><small>Expected today</small><strong>6</strong><p>Visitors & service visits</p></article><article><span><Icon name="check" size={19} /></span><small>Checked out today</small><strong>18</strong><p>Clear movement history</p></article><article><span><Icon name="tool" size={19} /></span><small>Open requests</small><strong>4</strong><p>2 need attention</p></article></section>

            <section className="security-dashboard-grid">
              <article className="security-panel security-presence-panel"><div className="security-panel-head"><div><small>Building visibility</small><h2>Who is in the building?</h2></div><span className="live-chip"><i /> Live</span></div><div className="presence-tabs"><button className="is-active">Present</button><button>Expected</button><button>History</button></div><div className="presence-table">{presence.map((person) => <div className="presence-item" key={person.name}><span className={`presence-avatar presence-avatar--${person.kind}`}><Icon name={person.kind === 'resident' ? 'home' : person.kind === 'guest' ? 'users' : 'tool'} size={16} /></span><div><strong>{person.name}</strong><small>{person.unit}</small></div><span className={`presence-state presence-state--${person.status.toLowerCase()}`}>{person.status}<small>{person.time}</small></span></div>)}</div><button className="security-text-link" onClick={() => navigate(`/app/${role}/people-and-presence`)}>Open full presence log <Icon name="arrow-right" size={14} /></button></article>

              <article className="security-panel security-access-panel"><div className="security-panel-head"><div><small>Access control</small><h2>Visitor activity</h2></div><button className="icon-button icon-button--soft"><Icon name="filter" size={16} /></button></div><div className="access-list"><div><span className="access-icon access-icon--green"><Icon name="check" size={15} /></span><section><strong>Grace W. approved</strong><small>Arriving today · 2:30 PM</small></section><b>Approved</b></div><div><span className="access-icon access-icon--blue"><Icon name="tool" size={15} /></span><section><strong>DenzeK Services</strong><small>Service visit · 4:00 PM</small></section><b>Expected</b></div><div><span className="access-icon access-icon--amber"><Icon name="key" size={15} /></span><section><strong>Mary Wambui</strong><small>Delivery · Tomorrow 10:00 AM</small></section><b>Pending</b></div></div><button className="security-text-link" onClick={() => navigate(`/app/${role}/visitor-access`)}>Manage visitor access <Icon name="arrow-right" size={14} /></button></article>
            </section>

            <section className="security-panel security-service-strip"><div className="security-panel-head"><div><small>Resident convenience</small><h2>Trusted services</h2></div><button className="security-text-link" onClick={() => navigate(`/app/${role}/service-providers`)}>View all <Icon name="arrow-right" size={14} /></button></div><div className="security-service-grid">{serviceCards.map((service) => <button key={service.title} className="security-service-card" onClick={() => navigate(`/app/${role}/service-providers`)}><img src={service.image} alt="" /><div><strong>{service.title}</strong><small>{service.text}</small></div></button>)}</div></section>

            <section className="security-panel security-report-banner"><div><span className="report-camera"><Icon name="camera" size={20} /></span><div><small>Need help?</small><h2>Raise a complaint or report with photos.</h2><p>Security, maintenance, noise or anything affecting your home can be logged and tracked.</p></div></div><button className="button button--primary" onClick={() => setReportOpen(true)}>Raise a report <Icon name="arrow-right" size={16} /></button></section>
          </> : <section className="security-panel security-coming-soon"><span className="modal-icon"><Icon name="clock" size={23} /></span><small>{roleName}</small><h1>{activeLabel}</h1><p>This focused MongaLets workspace is being prepared. The priority remains security, access, reports and trusted services.</p><button className="button button--primary" onClick={() => navigate(`/app/${role}`)}>Back to overview</button></section>}
        </main>
      </div>

      {inviteOpen && <div className="security-modal-backdrop"><div className="security-modal"><button className="icon-button security-modal-close" onClick={() => setInviteOpen(false)}><Icon name="close" /></button><span className="modal-icon"><Icon name="key" size={22} /></span><h2>Invite a visitor</h2><p>Choose who is coming, when they should arrive and what access they need. The invitation can be shared or approved.</p><label>Visitor name<input placeholder="e.g. Grace Wanjiku" /></label><label>Expected date<input type="date" /></label><label>Purpose<select><option>Personal visit</option><option>Service visit</option><option>Delivery</option></select></label><div className="security-modal-actions"><button className="button button--secondary" onClick={() => setInviteOpen(false)}>Cancel</button><button className="button button--primary" onClick={() => setInviteOpen(false)}>Create invitation <Icon name="arrow-right" size={15} /></button></div></div></div>}
      {reportOpen && <div className="security-modal-backdrop"><div className="security-modal"><button className="icon-button security-modal-close" onClick={() => setReportOpen(false)}><Icon name="close" /></button><span className="modal-icon"><Icon name="camera" size={22} /></span><h2>Raise a report</h2><p>Give security or management enough detail to act quickly. Add photos when useful.</p><label>Category<select><option>Maintenance</option><option>Security incident</option><option>Noise / neighbour</option><option>Other</option></select></label><label>Description<textarea rows={4} placeholder="What happened?" /></label><label>Photos<input type="file" accept="image/*" multiple /></label><div className="security-modal-actions"><button className="button button--secondary" onClick={() => setReportOpen(false)}>Cancel</button><button className="button button--primary" onClick={() => setReportOpen(false)}>Submit report <Icon name="check" size={15} /></button></div></div></div>}
      {notificationsOpen && <div className="security-modal-backdrop"><div className="security-modal security-notifications"><button className="icon-button security-modal-close" onClick={() => setNotificationsOpen(false)}><Icon name="close" /></button><span className="modal-icon"><Icon name="bell" size={22} /></span><h2>Updates</h2><div className="notification-item"><span><Icon name="check" size={15} /></span><div><strong>Visitor approved</strong><small>Grace W. is expected today at 2:30 PM.</small></div></div><div className="notification-item"><span><Icon name="tool" size={15} /></span><div><strong>Request updated</strong><small>Plumbing report has a provider scheduled.</small></div></div><button className="button button--secondary button--full" onClick={() => setNotificationsOpen(false)}>Done</button></div></div>}
    </div>
  )
}
