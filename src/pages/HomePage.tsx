import { useMemo, useState } from 'react'
import { PublicNav } from '../components/PublicNav'
import { Icon, type IconName } from '../components/Icon'
import { Modal } from '../components/Modal'
import { Logo } from '../components/Logo'
import { navigate } from '../lib/router'
import type { Role, Session } from '../lib/types'

type RoleCard = {
  role: Role
  title: string
  label: string
  description: string
  icon: IconName
  bullets: string[]
  stat: string
  statLabel: string
}

const roles: RoleCard[] = [
  {
    role: 'owner',
    title: 'Owners & facility teams',
    label: 'Portfolio command centre',
    description: 'Manage properties, units, occupancy, rent, bookings, maintenance, staff and financial performance from one connected workspace.',
    icon: 'building',
    bullets: ['Multi-property portfolio', 'Rent and booking income', 'Requests, providers and approvals'],
    stat: '360°',
    statLabel: 'portfolio visibility',
  },
  {
    role: 'tenant',
    title: 'Tenants & residents',
    label: 'A better resident experience',
    description: 'Pay rent, access documents, report issues with photos, receive updates and manage visitors without chasing the facility office.',
    icon: 'home',
    bullets: ['Rent and receipts', 'Photo-rich issue reporting', 'Lease, visitors and announcements'],
    stat: '< 2 min',
    statLabel: 'to report an issue',
  },
  {
    role: 'provider',
    title: 'Service providers',
    label: 'Jobs, quotes and proof of work',
    description: 'Receive qualified opportunities, quote professionally, schedule work, upload before-and-after evidence and track payment.',
    icon: 'tool',
    bullets: ['Opportunity and job board', 'Quotations and scheduling', 'Earnings, reviews and verification'],
    stat: '1 view',
    statLabel: 'from quote to payout',
  },
  {
    role: 'guest',
    title: 'Guests & short-stay teams',
    label: 'Connected stays',
    description: 'Prepare for arrivals, communicate securely, add services, request help and complete check-in or checkout from a guest portal.',
    icon: 'key',
    bullets: ['Booking access and directions', 'Digital welcome guide', 'Add-ons and service requests'],
    stat: '24/7',
    statLabel: 'self-service access',
  },
]

const providerGroups = [
  { icon: 'tool' as IconName, title: 'Repairs & maintenance', text: 'Plumbing, electrical, appliance repair, painting, carpentry and general maintenance.' },
  { icon: 'sparkles' as IconName, title: 'Cleaning & housekeeping', text: 'Turnover cleaning, deep cleaning, laundry, pest control and waste management.' },
  { icon: 'briefcase' as IconName, title: 'Moving & logistics', text: 'Movers, furniture assembly, storage, deliveries and relocation support.' },
  { icon: 'shield' as IconName, title: 'Security & access', text: 'Security teams, access control, CCTV, locksmiths and emergency response.' },
  { icon: 'settings' as IconName, title: 'Utilities & connectivity', text: 'Internet installation, generators, solar, water systems and meter services.' },
  { icon: 'star' as IconName, title: 'Guest experience', text: 'Airport transfer, catering, décor, local experiences and short-stay add-ons.' },
]

const capabilities = [
  { icon: 'calendar' as IconName, title: 'One operational calendar', text: 'Bookings, rent dates, inspections, maintenance, provider visits and staff tasks stay in sync.' },
  { icon: 'message' as IconName, title: 'Unified communication', text: 'Messages, announcements and FikraWorks BulkSMS alerts are recorded against the right person and property.' },
  { icon: 'camera' as IconName, title: 'Evidence at every step', text: 'Photo and video attachments, before-and-after records, documents, signatures and complete timelines.' },
  { icon: 'wallet' as IconName, title: 'Financial clarity', text: 'Track rent, bookings, service charges, expenses, provider payouts, receipts and property performance.' },
]

function DashboardPreview() {
  return (
    <div className="dashboard-preview" aria-label="MongaLets owner dashboard preview">
      <div className="dashboard-preview__sidebar">
        <div className="dashboard-preview__mini-logo"><Icon name="building" size={17} /></div>
        {['grid', 'building', 'calendar', 'tool', 'wallet', 'message'].map((name, index) => (
          <span key={name} className={index === 0 ? 'is-active' : ''}><Icon name={name as IconName} size={17} /></span>
        ))}
      </div>
      <div className="dashboard-preview__main">
        <div className="dashboard-preview__top">
          <div>
            <small>Good afternoon, Denzel</small>
            <strong>Your portfolio is performing well</strong>
          </div>
          <div className="dashboard-preview__avatar">DO</div>
        </div>
        <div className="dashboard-preview__metrics">
          <article><span><Icon name="building" size={16} /></span><small>Properties</small><strong>12</strong><em>+2 this year</em></article>
          <article><span><Icon name="home" size={16} /></span><small>Occupancy</small><strong>91%</strong><em>46 of 51 units</em></article>
          <article><span><Icon name="wallet" size={16} /></span><small>Collected</small><strong>KES 1.84M</strong><em>94% of expected</em></article>
        </div>
        <div className="dashboard-preview__content">
          <section className="dashboard-preview__chart">
            <div className="mini-heading"><div><small>Portfolio income</small><strong>Collection trend</strong></div><span>6 months</span></div>
            <div className="chart-bars">
              {[54, 66, 61, 76, 72, 88, 84, 96].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
            </div>
            <div className="chart-labels"><span>Jan</span><span>Mar</span><span>May</span><span>Jul</span></div>
          </section>
          <section className="dashboard-preview__activity">
            <div className="mini-heading"><div><small>Today</small><strong>What needs attention</strong></div><span className="status-dot">4</span></div>
            <div className="activity-row"><span className="activity-row__icon amber"><Icon name="tool" size={14} /></span><div><strong>Plumbing request</strong><small>Marina Bay · Unit A5G</small></div><em>Urgent</em></div>
            <div className="activity-row"><span className="activity-row__icon green"><Icon name="key" size={14} /></span><div><strong>Guest check-in</strong><small>Elegant apartment · 3:00 PM</small></div><em>Today</em></div>
            <div className="activity-row"><span className="activity-row__icon blue"><Icon name="receipt" size={14} /></span><div><strong>Rent approval</strong><small>7 payments reconciled</small></div><em>Review</em></div>
          </section>
        </div>
      </div>
      <div className="floating-sync-card">
        <span><Icon name="sync" size={18} /></span>
        <div><strong>Everything stays in sync</strong><small>Tenant update shared with owner and provider</small></div>
        <i><Icon name="check" size={13} /></i>
      </div>
    </div>
  )
}

export function HomePage({ session }: { session: Session | null }) {
  const [selectedRole, setSelectedRole] = useState<RoleCard | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<(typeof providerGroups)[number] | null>(null)
  const [contactOpen, setContactOpen] = useState(false)
  const [contactSent, setContactSent] = useState(false)

  const currentYear = useMemo(() => new Date().getFullYear(), [])

  return (
    <div className="public-site">
      <PublicNav session={session} />

      <main>
        <section className="hero section" id="platform">
          <div className="hero__orb hero__orb--one" />
          <div className="hero__orb hero__orb--two" />
          <div className="container hero__grid">
            <div className="hero__copy">
              <div className="hero__pill"><span><Icon name="sparkles" size={15} /></span> Property management, reimagined for Africa</div>
              <h1>Every property.<br /><span>Every person.</span><br />One connected system.</h1>
              <p className="hero__lead">MongaLets brings listings, facilities, tenants, guests and trusted service providers into one beautiful, accountable property ecosystem.</p>
              <div className="hero__actions">
                <button className="button button--primary button--large" onClick={() => navigate(session ? `/app/${session.role}` : '/login')}>
                  {session ? 'Open your dashboard' : 'Enter MongaLets'}
                  <Icon name="arrow-right" size={18} />
                </button>
                <button className="button button--secondary button--large" onClick={() => document.querySelector('#roles')?.scrollIntoView({ behavior: 'smooth' })}>
                  Explore the platform
                </button>
              </div>
              <div className="hero__trust">
                <div className="hero__avatars"><span>DO</span><span>AN</span><span>DS</span><span>SA</span></div>
                <div><strong>Built for the whole property journey</strong><small>Owners · Tenants · Providers · Guests</small></div>
              </div>
            </div>

            <div className="hero__visual">
              <div className="hero__image-frame">
                <img src="/assets/hero-property.svg" alt="Modern MongaLets managed property" />
                <div className="hero__property-card">
                  <span className="hero__property-icon"><Icon name="building" size={18} /></span>
                  <div><small>Selected portfolio</small><strong>Marina Bay Apartments</strong><em>91% occupied · Nairobi</em></div>
                  <button aria-label="Open property"><Icon name="arrow-right" size={16} /></button>
                </div>
                <div className="hero__status-card">
                  <span><Icon name="check" size={15} /></span>
                  <div><strong>Service request resolved</strong><small>Tenant notified instantly</small></div>
                </div>
              </div>
              <div className="hero__feature-row">
                <article><Icon name="calendar" size={19} /><div><strong>Smart calendar</strong><small>Bookings, rent and jobs</small></div></article>
                <article><Icon name="message" size={19} /><div><strong>FikraWorks BulkSMS</strong><small>Reliable alerts and OTPs</small></div></article>
                <article><Icon name="chart" size={19} /><div><strong>Live insights</strong><small>Every coin, every unit</small></div></article>
              </div>
            </div>
          </div>
        </section>

        <section className="trust-strip">
          <div className="container trust-strip__inner">
            <span>Designed for</span>
            <strong>Residential portfolios</strong>
            <i />
            <strong>Serviced apartments</strong>
            <i />
            <strong>Commercial facilities</strong>
            <i />
            <strong>Short stays</strong>
            <i />
            <strong>Property service teams</strong>
          </div>
        </section>

        <section className="section roles-section" id="roles">
          <div className="container">
            <div className="section-heading section-heading--split">
              <div>
                <span className="eyebrow">One ecosystem, designed around people</span>
                <h2>Different roles. One shared source of truth.</h2>
              </div>
              <p>Each person gets a focused workspace while updates, approvals, documents and communication stay connected behind the scenes.</p>
            </div>
            <div className="role-grid">
              {roles.map((item, index) => (
                <article className={`role-card role-card--${index + 1}`} key={item.role}>
                  <div className="role-card__top">
                    <span className="role-card__icon"><Icon name={item.icon} size={24} /></span>
                    <span className="role-card__number">0{index + 1}</span>
                  </div>
                  <small>{item.label}</small>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="role-card__stat"><strong>{item.stat}</strong><span>{item.statLabel}</span></div>
                  <button onClick={() => setSelectedRole(item)}>See role experience <Icon name="arrow-right" size={16} /></button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section sync-section" id="experience">
          <div className="container sync-section__grid">
            <div className="sync-section__copy">
              <span className="eyebrow eyebrow--light">Connected operations</span>
              <h2>From “there is a problem” to “it is solved” — without losing context.</h2>
              <p>A tenant can report an issue with photos. The owner reviews it. A provider quotes and schedules. Everyone receives the right update, and every action is captured in one timeline.</p>
              <div className="sync-flow">
                <div><span>1</span><strong>Tenant reports</strong><small>Photos, location, priority and preferred time</small></div>
                <i><Icon name="arrow-right" size={17} /></i>
                <div><span>2</span><strong>Owner approves</strong><small>Assign provider, approve quote and schedule</small></div>
                <i><Icon name="arrow-right" size={17} /></i>
                <div><span>3</span><strong>Provider resolves</strong><small>Check in, work, upload evidence and close</small></div>
              </div>
              <button className="button button--cream" onClick={() => navigate('/login/tenant')}>Experience a role login <Icon name="arrow-right" size={17} /></button>
            </div>
            <DashboardPreview />
          </div>
        </section>

        <section className="section capability-section">
          <div className="container">
            <div className="section-heading section-heading--center">
              <span className="eyebrow">The operating layer behind every property</span>
              <h2>Beautiful on the surface. Powerful underneath.</h2>
              <p>Designed to replace scattered WhatsApp chats, spreadsheets, paper receipts and disconnected booking tools.</p>
            </div>
            <div className="capability-grid">
              {capabilities.map((item) => (
                <article key={item.title}>
                  <span><Icon name={item.icon} size={23} /></span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
            <div className="property-showcase">
              <article className="property-showcase__large">
                <img src="/assets/property-city.svg" alt="Modern city apartment visual" />
                <div className="property-showcase__overlay"><small>Long-term rentals</small><strong>Manage every unit and resident</strong><span>Leases · Rent · Requests · Visitors</span></div>
              </article>
              <article>
                <img src="/assets/property-villa.svg" alt="Villa and holiday property visual" />
                <div className="property-showcase__overlay"><small>Short stays</small><strong>Bookings that flow into operations</strong><span>Calendar · Guests · Cleaning · Add-ons</span></div>
              </article>
              <article>
                <img src="/assets/property-coast.svg" alt="Coastal serviced apartment visual" />
                <div className="property-showcase__overlay"><small>Facility portfolios</small><strong>See performance across locations</strong><span>Occupancy · Income · Teams · Reports</span></div>
              </article>
            </div>
          </div>
        </section>

        <section className="section providers-section" id="providers">
          <div className="container providers-section__grid">
            <div className="providers-section__intro">
              <span className="eyebrow">Trusted property services</span>
              <h2>A provider network built into the workflow.</h2>
              <p>Owners can work with their existing teams or onboard verified providers. Providers receive clearer jobs, faster approvals and a professional record of their work.</p>
              <div className="providers-section__quote">
                <span><Icon name="tool" size={20} /></span>
                <div><strong>No more vague job requests.</strong><small>Location, media, access instructions, quote, schedule and proof of completion stay together.</small></div>
              </div>
              <button className="button button--primary" onClick={() => navigate('/login/provider')}>Join as a provider <Icon name="arrow-right" size={17} /></button>
            </div>
            <div className="provider-grid">
              {providerGroups.map((provider) => (
                <button key={provider.title} className="provider-card" onClick={() => setSelectedProvider(provider)}>
                  <span><Icon name={provider.icon} size={21} /></span>
                  <div><strong>{provider.title}</strong><small>{provider.text}</small></div>
                  <Icon name="arrow-right" size={17} />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section sms-section">
          <div className="container sms-section__card">
            <div className="sms-section__phone">
              <div className="phone-shell">
                <div className="phone-shell__notch" />
                <div className="phone-shell__screen">
                  <small>Messages</small>
                  <div className="message-bubble">
                    <span>ML</span>
                    <div><strong>MongaLets</strong><p>Your plumbing visit is confirmed for today at 2:30 PM. Provider: DenzeK Services.</p><small>Delivered via FikraWorks BulkSMS · 1:12 PM</small></div>
                  </div>
                  <div className="message-bubble">
                    <span>ML</span>
                    <div><strong>MongaLets</strong><p>Payment received. Receipt ML-24881 is now available in your tenant portal.</p><small>Delivered · 11:08 AM</small></div>
                  </div>
                </div>
              </div>
              <span className="sms-float sms-float--one"><Icon name="check" size={14} /> Delivered</span>
              <span className="sms-float sms-float--two"><Icon name="bell" size={14} /> Instant alert</span>
            </div>
            <div className="sms-section__copy">
              <span className="eyebrow eyebrow--light">FikraWorks BulkSMS built in</span>
              <h2>Important updates reach people even when they are not inside the app.</h2>
              <p>Send one-time passwords, rent reminders, booking confirmations, arrival instructions, provider updates, payment receipts and emergency announcements.</p>
              <ul>
                <li><Icon name="check" size={16} /> Automated event-based messages</li>
                <li><Icon name="check" size={16} /> Property, building and audience targeting</li>
                <li><Icon name="check" size={16} /> Delivery status and communication history</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section final-cta" id="contact">
          <div className="container final-cta__card">
            <div>
              <span className="eyebrow eyebrow--light">The foundation is ready</span>
              <h2>Start with your role. Grow into the full MongaLets ecosystem.</h2>
              <p>The first frontend release covers this public experience, role-aware authentication and responsive portal foundations for owners, tenants, providers, guests and platform administrators.</p>
            </div>
            <div className="final-cta__actions">
              <button className="button button--cream button--large" onClick={() => navigate('/login')}>Choose your role <Icon name="arrow-right" size={18} /></button>
              <button className="button button--outline-light button--large" onClick={() => { setContactSent(false); setContactOpen(true) }}>Request a walkthrough</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__top">
          <div className="footer__brand"><Logo inverse /><p>Property, facility, listings and service management in one connected platform.</p></div>
          <div><strong>Platform</strong><button onClick={() => document.querySelector('#roles')?.scrollIntoView({ behavior: 'smooth' })}>Roles</button><button onClick={() => document.querySelector('#providers')?.scrollIntoView({ behavior: 'smooth' })}>Service providers</button><button onClick={() => navigate('/login')}>Login</button></div>
          <div><strong>Solutions</strong><span>Long-term rentals</span><span>Short stays</span><span>Facility operations</span></div>
          <div><strong>Powered by</strong><span>FikraWorks Technologies</span><span>FikraWorks BulkSMS</span><span>ReviewsPro ready</span></div>
        </div>
        <div className="container footer__bottom"><span>© {currentYear} MongaLets. A FikraWorks Technologies product.</span><span>Privacy · Terms · Security</span></div>
      </footer>

      <Modal open={Boolean(selectedRole)} onClose={() => setSelectedRole(null)} title={selectedRole?.title ?? ''} eyebrow={selectedRole?.label} size="medium">
        {selectedRole && (
          <div className="role-modal">
            <div className="role-modal__visual"><span><Icon name={selectedRole.icon} size={38} /></span><strong>{selectedRole.stat}</strong><small>{selectedRole.statLabel}</small></div>
            <p>{selectedRole.description}</p>
            <ul>{selectedRole.bullets.map((bullet) => <li key={bullet}><Icon name="check" size={16} /> {bullet}</li>)}</ul>
            <button className="button button--primary button--full" onClick={() => navigate(`/login/${selectedRole.role}`)}>Continue to {selectedRole.role} login <Icon name="arrow-right" size={17} /></button>
          </div>
        )}
      </Modal>

      <Modal open={Boolean(selectedProvider)} onClose={() => setSelectedProvider(null)} title={selectedProvider?.title ?? ''} eyebrow="Provider category" size="small">
        {selectedProvider && (
          <div className="provider-modal">
            <span><Icon name={selectedProvider.icon} size={30} /></span>
            <p>{selectedProvider.text}</p>
            <div className="provider-modal__steps"><div><b>1</b><small>Receive a complete request</small></div><div><b>2</b><small>Quote and schedule</small></div><div><b>3</b><small>Complete and get reviewed</small></div></div>
            <button className="button button--primary button--full" onClick={() => navigate('/login/provider')}>Open provider login <Icon name="arrow-right" size={17} /></button>
          </div>
        )}
      </Modal>

      <Modal open={contactOpen} onClose={() => setContactOpen(false)} title={contactSent ? 'Walkthrough request received' : 'Request a MongaLets walkthrough'} eyebrow="FikraWorks Technologies" size="small">
        {contactSent ? (
          <div className="success-state"><span><Icon name="check" size={30} /></span><h3>Thank you.</h3><p>This demonstration form is ready to connect to the production contact workflow.</p><button className="button button--primary button--full" onClick={() => setContactOpen(false)}>Done</button></div>
        ) : (
          <form className="contact-form" onSubmit={(event) => { event.preventDefault(); setContactSent(true) }}>
            <label>Full name<input required placeholder="Your name" /></label>
            <label>Phone or email<input required placeholder="How should we reach you?" /></label>
            <label>What do you manage?<select defaultValue=""><option value="" disabled>Select one</option><option>Residential properties</option><option>Serviced apartments or BnB</option><option>Commercial facilities</option><option>Property services</option></select></label>
            <button className="button button--primary button--full" type="submit">Submit request <Icon name="arrow-right" size={17} /></button>
          </form>
        )}
      </Modal>
    </div>
  )
}
