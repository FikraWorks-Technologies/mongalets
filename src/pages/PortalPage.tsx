import { useMemo, useState } from 'react'
import { Icon, type IconName } from '../components/Icon'
import { Logo } from '../components/Logo'
import { Modal } from '../components/Modal'
import { DashboardPage } from './DashboardPages'
import { clearSession } from '../lib/session'
import { navigate } from '../lib/router'
import type { Role, Session } from '../lib/types'

type NavItem = { icon: IconName; label: string; badge?: string }

function navSlug(label: string) {
  return label.toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

type PortalConfig = {
  title: string
  subtitle: string
  context: string
  nav: NavItem[]
  metrics: Array<{ icon: IconName; label: string; value: string; note: string; trend?: string }>
}

const portalConfig: Record<Role, PortalConfig> = {
  owner: {
    title: 'Portfolio command centre',
    subtitle: 'See what is performing, what needs attention and what happens next.',
    context: 'All properties',
    nav: [
      { icon: 'grid', label: 'Overview' }, { icon: 'building', label: 'Properties' }, { icon: 'home', label: 'Units & tenants' },
      { icon: 'calendar', label: 'Calendar', badge: '6' }, { icon: 'tool', label: 'Requests', badge: '4' }, { icon: 'briefcase', label: 'Providers' },
      { icon: 'wallet', label: 'Finances' }, { icon: 'message', label: 'Messages', badge: '3' }, { icon: 'chart', label: 'Reports' }, { icon: 'settings', label: 'Settings' },
    ],
    metrics: [
      { icon: 'building', label: 'Properties', value: '12', note: '51 total units', trend: '+2 this year' },
      { icon: 'home', label: 'Occupancy', value: '91%', note: '46 occupied units', trend: '+3.2%' },
      { icon: 'wallet', label: 'Collected this month', value: 'KES 1.84M', note: '94% of expected', trend: '+8.4%' },
      { icon: 'tool', label: 'Open requests', value: '9', note: '2 need approval', trend: '4 urgent' },
    ],
  },
  tenant: {
    title: 'Welcome home, Amina',
    subtitle: 'Your rent, lease, requests and property updates are all here.',
    context: 'Marina Bay · A5G',
    nav: [
      { icon: 'grid', label: 'Home' }, { icon: 'wallet', label: 'Rent & payments' }, { icon: 'tool', label: 'My requests', badge: '2' },
      { icon: 'clipboard', label: 'Lease & documents' }, { icon: 'users', label: 'Visitors' }, { icon: 'calendar', label: 'Calendar' },
      { icon: 'bell', label: 'Announcements', badge: '1' }, { icon: 'message', label: 'Messages' }, { icon: 'settings', label: 'Profile' },
    ],
    metrics: [
      { icon: 'wallet', label: 'Rent status', value: 'Paid', note: 'Next due 1 Sep 2026', trend: 'Receipt ready' },
      { icon: 'clipboard', label: 'Lease remaining', value: '8 months', note: 'Expires 30 Apr 2027', trend: 'Active' },
      { icon: 'tool', label: 'Open requests', value: '2', note: '1 provider scheduled', trend: 'Updated today' },
      { icon: 'users', label: 'Visitor passes', value: '1', note: 'Valid until 8:00 PM', trend: 'Today' },
    ],
  },
  provider: {
    title: 'Good afternoon, DenzeK',
    subtitle: 'Your opportunities, schedule, active work and earnings in one place.',
    context: 'DenzeK Services',
    nav: [
      { icon: 'grid', label: 'Overview' }, { icon: 'briefcase', label: 'Opportunities', badge: '3' }, { icon: 'tool', label: 'My jobs', badge: '4' },
      { icon: 'receipt', label: 'Quotations', badge: '2' }, { icon: 'calendar', label: 'Schedule' }, { icon: 'map', label: 'Job map' },
      { icon: 'wallet', label: 'Earnings' }, { icon: 'star', label: 'Reviews' }, { icon: 'message', label: 'Messages', badge: '2' }, { icon: 'settings', label: 'Business profile' },
    ],
    metrics: [
      { icon: 'calendar', label: 'Today’s jobs', value: '3', note: 'First visit at 2:30 PM', trend: 'On schedule' },
      { icon: 'receipt', label: 'Pending quotes', value: '2', note: 'KES 31,500 potential', trend: 'Respond today' },
      { icon: 'wallet', label: 'August earnings', value: 'KES 86,200', note: 'KES 22,000 pending', trend: '+12.8%' },
      { icon: 'star', label: 'Provider rating', value: '4.8', note: '42 verified reviews', trend: 'Top 8%' },
    ],
  },
  guest: {
    title: 'Your stay is almost here, Sarah',
    subtitle: 'Everything you need before arrival and throughout your stay.',
    context: 'Elegant & Stylish Apartment',
    nav: [
      { icon: 'grid', label: 'Stay overview' }, { icon: 'key', label: 'Check-in' }, { icon: 'map', label: 'Directions' },
      { icon: 'sparkles', label: 'Guest services' }, { icon: 'tool', label: 'Request help' }, { icon: 'receipt', label: 'Receipt' },
      { icon: 'message', label: 'Message host' }, { icon: 'star', label: 'Review stay' }, { icon: 'settings', label: 'Guest details' },
    ],
    metrics: [
      { icon: 'calendar', label: 'Check-in', value: '28 Aug', note: 'From 3:00 PM', trend: '24 days away' },
      { icon: 'calendar', label: 'Check-out', value: '30 Aug', note: 'By 11:00 AM', trend: '2-night stay' },
      { icon: 'wallet', label: 'Payment', value: 'Paid', note: 'KES 17,600 total', trend: 'Receipt ready' },
      { icon: 'key', label: 'Access', value: 'Pending', note: 'Code issued 24 hours before', trend: 'Automatic' },
    ],
  },
  admin: {
    title: 'MongaLets platform overview',
    subtitle: 'Organizations, users, transactions and operational health across the ecosystem.',
    context: 'All organizations',
    nav: [
      { icon: 'grid', label: 'System overview' }, { icon: 'building', label: 'Organizations' }, { icon: 'users', label: 'Users' },
      { icon: 'briefcase', label: 'Providers' }, { icon: 'shield', label: 'Verification', badge: '8' }, { icon: 'message', label: 'BulkSMS' },
      { icon: 'wallet', label: 'Subscriptions' }, { icon: 'chart', label: 'Analytics' }, { icon: 'alert', label: 'Integrity centre', badge: '3' }, { icon: 'settings', label: 'System settings' },
    ],
    metrics: [
      { icon: 'building', label: 'Organizations', value: '38', note: '12 trials active', trend: '+7 this month' },
      { icon: 'users', label: 'Active users', value: '1,248', note: 'Across all roles', trend: '+18.6%' },
      { icon: 'message', label: 'SMS delivered', value: '98.7%', note: '12,408 this month', trend: 'Healthy' },
      { icon: 'shield', label: 'Pending reviews', value: '8', note: 'Provider verification', trend: '3 urgent' },
    ],
  },
}

function RoleSpecificPanel({ role }: { role: Role }) {
  if (role === 'owner' || role === 'admin') {
    return (
      <div className="portal-grid portal-grid--two">
        <section className="portal-card portal-chart-card">
          <div className="portal-card__header"><div><small>Financial performance</small><h3>{role === 'owner' ? 'Income collection trend' : 'Platform revenue trend'}</h3></div><button className="filter-button">Last 6 months <Icon name="chevron-down" size={14} /></button></div>
          <div className="large-chart">
            <div className="large-chart__y"><span>2.0M</span><span>1.5M</span><span>1.0M</span><span>500K</span><span>0</span></div>
            <div className="large-chart__plot">
              <div className="large-chart__grid"><i /><i /><i /><i /><i /></div>
              <svg viewBox="0 0 600 220" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1c8f82" stopOpacity=".34"/><stop offset="1" stopColor="#1c8f82" stopOpacity="0"/></linearGradient></defs><path d="M0 182 C62 164,80 135,128 147 S216 105,260 119 S337 57,390 85 S483 35,600 48 V220 H0Z" fill="url(#area)"/><path d="M0 182 C62 164,80 135,128 147 S216 105,260 119 S337 57,390 85 S483 35,600 48" fill="none" stroke="#16796e" strokeWidth="5" strokeLinecap="round"/><g fill="#fff" stroke="#16796e" strokeWidth="4"><circle cx="128" cy="147" r="6"/><circle cx="260" cy="119" r="6"/><circle cx="390" cy="85" r="6"/><circle cx="600" cy="48" r="6"/></g></svg>
              <div className="large-chart__x"><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span></div>
            </div>
          </div>
        </section>
        <section className="portal-card">
          <div className="portal-card__header"><div><small>Action centre</small><h3>Needs your attention</h3></div><button className="icon-button icon-button--soft"><Icon name="filter" size={17} /></button></div>
          <div className="attention-list">
            <article><span className="attention-icon attention-icon--amber"><Icon name="tool" size={17} /></span><div><strong>2 quotations need approval</strong><small>Marina Bay and Spring Valley</small></div><button>Review</button></article>
            <article><span className="attention-icon attention-icon--red"><Icon name="alert" size={17} /></span><div><strong>4 rent accounts are overdue</strong><small>KES 118,000 outstanding</small></div><button>View</button></article>
            <article><span className="attention-icon attention-icon--blue"><Icon name="key" size={17} /></span><div><strong>3 guest arrivals tomorrow</strong><small>2 access codes pending</small></div><button>Prepare</button></article>
            <article><span className="attention-icon attention-icon--green"><Icon name="shield" size={17} /></span><div><strong>Provider document updated</strong><small>DenzeK insurance certificate</small></div><button>Verify</button></article>
          </div>
        </section>
      </div>
    )
  }

  if (role === 'provider') {
    return (
      <div className="portal-grid portal-grid--provider">
        <section className="portal-card provider-today">
          <div className="portal-card__header"><div><small>Tuesday, 4 August</small><h3>Today’s route</h3></div><button className="filter-button"><Icon name="map" size={14} /> Map view</button></div>
          <div className="provider-route">
            <div className="provider-route__line" />
            <article><time>2:30 PM</time><span className="route-dot route-dot--active" /><div><div className="job-badge">Next job</div><strong>Move-in support</strong><small>Marina Bay Apartments · Building A, Floor 5</small><p>Moving equipment and furniture from Block A to Block B.</p><div className="job-actions"><button className="button button--primary button--small">Start route</button><button className="button button--secondary button--small">Message</button></div></div></article>
            <article><time>4:15 PM</time><span className="route-dot" /><div><strong>Electrical inspection</strong><small>Kilimani Heights · Unit C204</small></div></article>
            <article><time>6:00 PM</time><span className="route-dot" /><div><strong>Quotation visit</strong><small>Spring Valley Villas · House 12</small></div></article>
          </div>
        </section>
        <section className="portal-card opportunity-card">
          <div className="portal-card__header"><div><small>New near you</small><h3>Qualified opportunities</h3></div><span className="pill">3 available</span></div>
          <article><span><Icon name="tool" size={18} /></span><div><strong>Emergency plumbing</strong><small>Westlands · 3.2 km away</small><p>Kitchen pipe leak. Photos and access details available.</p><div><b>KES 4,000–7,000</b><em>Respond in 18 min</em></div></div><button><Icon name="arrow-right" size={17} /></button></article>
          <article><span><Icon name="sparkles" size={18} /></span><div><strong>Apartment deep clean</strong><small>Kileleshwa · 5.8 km away</small><p>Two-bedroom turnover clean before a guest arrival.</p><div><b>KES 3,500–5,500</b><em>Today</em></div></div><button><Icon name="arrow-right" size={17} /></button></article>
        </section>
      </div>
    )
  }

  if (role === 'tenant') {
    return (
      <div className="portal-grid portal-grid--tenant">
        <section className="portal-card tenant-home-card">
          <div className="tenant-home-card__image"><img src="/assets/property-city.svg" alt="Marina Bay apartment" /><span>Home</span></div>
          <div className="tenant-home-card__body"><small>Marina Bay Apartments</small><h3>Building A · Floor 5 · Unit A5G</h3><div className="tenant-home-card__details"><span><Icon name="clipboard" size={16} /> Lease active</span><span><Icon name="shield" size={16} /> Account verified</span><span><Icon name="users" size={16} /> 2 occupants</span></div><button className="button button--secondary button--small">View home profile</button></div>
        </section>
        <section className="portal-card">
          <div className="portal-card__header"><div><small>Request timeline</small><h3>Plumbing issue</h3></div><span className="pill pill--blue">Provider scheduled</span></div>
          <div className="request-timeline">
            <div className="is-done"><span><Icon name="check" size={12} /></span><div><strong>Request submitted</strong><small>Photos and preferred time added · 10:44 AM</small></div></div>
            <div className="is-done"><span><Icon name="check" size={12} /></span><div><strong>Provider assigned</strong><small>DenzeK Services · 11:08 AM</small></div></div>
            <div className="is-current"><span><Icon name="clock" size={12} /></span><div><strong>Visit scheduled</strong><small>Today between 2:30 PM and 3:30 PM</small></div></div>
            <div><span /><div><strong>Completion confirmation</strong><small>You will be asked to confirm the repair</small></div></div>
          </div>
        </section>
        <section className="portal-card tenant-announcement"><div className="portal-card__header"><div><small>Property update</small><h3>Water tank maintenance</h3></div><span className="pill">Tomorrow</span></div><p>Water supply may be interrupted between 10:00 AM and 12:00 PM while the main tank is serviced.</p><button className="text-button text-button--accent">Read announcement <Icon name="arrow-right" size={15} /></button></section>
      </div>
    )
  }

  return (
    <div className="portal-grid portal-grid--guest">
      <section className="portal-card guest-stay-card">
        <div className="guest-stay-card__image"><img src="/assets/property-coast.svg" alt="Elegant and Stylish Apartment" /><span className="pill pill--dark">Confirmed</span></div>
        <div className="guest-stay-card__body"><small>Your upcoming stay</small><h3>Elegant & Stylish Apartment</h3><p>Marina Bay · Building A · Fifth floor</p><div className="guest-dates"><div><small>Check-in</small><strong>28 Aug</strong><span>After 3:00 PM</span></div><i><Icon name="arrow-right" size={18} /></i><div><small>Check-out</small><strong>30 Aug</strong><span>Before 11:00 AM</span></div></div><button className="button button--primary button--full">Prepare for check-in <Icon name="arrow-right" size={17} /></button></div>
      </section>
      <section className="portal-card">
        <div className="portal-card__header"><div><small>Make your stay easier</small><h3>Guest services</h3></div><button className="text-button text-button--accent">See all</button></div>
        <div className="guest-services"><button><span><Icon name="map" size={19} /></span><strong>Airport transfer</strong><small>From KES 2,500</small></button><button><span><Icon name="sparkles" size={19} /></span><strong>Extra cleaning</strong><small>From KES 1,500</small></button><button><span><Icon name="clock" size={19} /></span><strong>Late checkout</strong><small>Request availability</small></button><button><span><Icon name="message" size={19} /></span><strong>Message host</strong><small>Usually replies quickly</small></button></div>
      </section>
    </div>
  )
}

export function PortalPage({ role, section, session }: { role: Role; section?: string; session: Session }) {
  const config = portalConfig[role]
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const activeNav = config.nav.find((item) => navSlug(item.label) === section)?.label ?? config.nav[0].label
  const [quickOpen, setQuickOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const initials = useMemo(() => session.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase(), [session.name])

  const logOut = () => {
    clearSession()
    navigate('/login')
  }

  return (
    <div className="portal-shell">
      <aside className={`portal-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="portal-sidebar__top"><button className="logo-button" onClick={() => navigate('/')}><Logo inverse /></button><button className="icon-button portal-sidebar__close" onClick={() => setSidebarOpen(false)}><Icon name="close" /></button></div>
        <button className="workspace-switcher"><span><Icon name={role === 'owner' ? 'building' : role === 'provider' ? 'tool' : role === 'tenant' ? 'home' : role === 'guest' ? 'key' : 'shield'} size={18} /></span><div><small>Current workspace</small><strong>{config.context}</strong></div><Icon name="chevron-down" size={15} /></button>
        <nav className="portal-sidebar__nav">
          <small>Workspace</small>
          {config.nav.map((item, index) => <button key={item.label} className={activeNav === item.label ? 'is-active' : ''} onClick={() => { navigate(index === 0 ? `/app/${role}` : `/app/${role}/${navSlug(item.label)}`); setSidebarOpen(false) }}><Icon name={item.icon} size={18} /><span>{item.label}</span>{item.badge && <b>{item.badge}</b>}</button>)}
        </nav>
        <div className="portal-sidebar__footer"><button onClick={() => navigate('/login')}><Icon name="users" size={18} /> Switch role</button><button onClick={logOut}><Icon name="logout" size={18} /> Sign out</button><div><span>{initials}</span><section><strong>{session.name}</strong><small>{session.email}</small></section><button aria-label="Account settings"><Icon name="settings" size={16} /></button></div></div>
      </aside>

      <div className="portal-main">
        <header className="portal-topbar">
          <div className="portal-topbar__left"><button className="icon-button portal-topbar__menu" onClick={() => setSidebarOpen(true)}><Icon name="menu" /></button><div className="portal-breadcrumb"><span>MongaLets</span><Icon name="arrow-right" size={13} /><strong>{activeNav}</strong></div></div>
          <div className="portal-topbar__actions"><button className="portal-search"><Icon name="search" size={17} /><span>Search properties, people, jobs...</span><kbd>⌘ K</kbd></button><button className="icon-button icon-button--bordered" onClick={() => setNotificationsOpen(true)}><Icon name="bell" size={19} /><i /></button><button className="button button--primary button--small" onClick={() => setQuickOpen(true)}><Icon name="plus" size={16} /> Quick action</button><button className="portal-avatar" onClick={() => setQuickOpen(true)}>{initials}</button></div>
        </header>

        <main className="portal-content">
          {activeNav === config.nav[0].label ? <>
            <section className="portal-welcome"><div><span className="eyebrow">{config.context}</span><h1>{config.title}</h1><p>{config.subtitle}</p></div><div className="portal-welcome__actions"><button className="button button--secondary" onClick={() => { const calendarItem = config.nav.find((item) => item.label === 'Calendar' || item.label === 'Schedule'); if (calendarItem) navigate(`/app/${role}/${navSlug(calendarItem.label)}`) }}><Icon name="calendar" size={17} /> View calendar</button><button className="button button--primary" onClick={() => setQuickOpen(true)}><Icon name="plus" size={17} /> {role === 'owner' ? 'Add property' : role === 'tenant' ? 'Report an issue' : role === 'provider' ? 'Create quotation' : role === 'guest' ? 'Request a service' : 'Add organization'}</button></div></section>

            <section className="metric-grid">
              {config.metrics.map((metric) => <article key={metric.label}><div className="metric-card__top"><span><Icon name={metric.icon} size={19} /></span><em><Icon name="arrow-up" size={12} /> {metric.trend}</em></div><small>{metric.label}</small><strong>{metric.value}</strong><p>{metric.note}</p></article>)}
            </section>

            <RoleSpecificPanel role={role} />
          </> : <DashboardPage role={role} page={activeNav} />}
        </main>
      </div>

      <Modal open={quickOpen} onClose={() => setQuickOpen(false)} title="Quick action" eyebrow={`${config.context} · ${role}`} size="small">
        <div className="quick-action-grid">
          {(role === 'owner' ? [
            ['building', 'Add property', 'Start a property profile'], ['home', 'Add tenant', 'Invite and assign a unit'], ['tool', 'Create request', 'Log maintenance or repair'], ['message', 'Send announcement', 'Notify a selected audience'],
          ] : role === 'tenant' ? [
            ['tool', 'Report an issue', 'Add photos and preferred time'], ['wallet', 'Pay rent', 'M-Pesa and payment options'], ['users', 'Create visitor pass', 'Share controlled access'], ['message', 'Message facility team', 'Start a secure conversation'],
          ] : role === 'provider' ? [
            ['receipt', 'Create quotation', 'Build a clear cost estimate'], ['calendar', 'Update availability', 'Set working hours and days'], ['camera', 'Upload proof of work', 'Before-and-after evidence'], ['message', 'Message a client', 'Open job-linked conversation'],
          ] : role === 'guest' ? [
            ['key', 'Prepare check-in', 'Confirm arrival details'], ['sparkles', 'Add a service', 'Transfer, cleaning and more'], ['tool', 'Request help', 'Report a stay issue'], ['message', 'Message host', 'Secure booking conversation'],
          ] : [
            ['building', 'Add organization', 'Create an owner workspace'], ['users', 'Invite user', 'Assign a system role'], ['shield', 'Review provider', 'Verify submitted documents'], ['message', 'Send system notice', 'Target selected users'],
          ]).map(([icon, title, text]) => <button key={title}><span><Icon name={icon as IconName} size={21} /></span><div><strong>{title}</strong><small>{text}</small></div><Icon name="arrow-right" size={16} /></button>)}
        </div>
      </Modal>

      <Modal open={notificationsOpen} onClose={() => setNotificationsOpen(false)} title="Notifications" eyebrow="Everything requiring your attention" size="small">
        <div className="notification-list">
          <article><span className="attention-icon attention-icon--amber"><Icon name="tool" size={16} /></span><div><strong>Request status changed</strong><p>The Marina Bay plumbing request is now scheduled for 2:30 PM.</p><small>8 minutes ago</small></div></article>
          <article><span className="attention-icon attention-icon--green"><Icon name="wallet" size={16} /></span><div><strong>Payment received</strong><p>KES 28,000 was successfully reconciled against Unit A5G.</p><small>42 minutes ago</small></div></article>
          <article><span className="attention-icon attention-icon--blue"><Icon name="message" size={16} /></span><div><strong>New message</strong><p>DenzeK Services added a note to the moving service job.</p><small>1 hour ago</small></div></article>
        </div>
      </Modal>
    </div>
  )
}
