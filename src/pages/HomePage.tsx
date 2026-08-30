import { useState } from 'react'
import { PublicNav } from '../components/PublicNav'
import { Icon, type IconName } from '../components/Icon'
import { navigate } from '../lib/router'
import type { Session } from '../lib/types'

type Presence = { name: string; unit: string; status: string; time: string; kind: 'resident' | 'guest' | 'provider' }

const presence: Presence[] = [
  { name: 'Amina N.', unit: 'A-204', status: 'Inside', time: '10:42 AM', kind: 'resident' },
  { name: 'David O.', unit: 'B-112', status: 'Inside', time: '09:18 AM', kind: 'resident' },
  { name: 'Grace W.', unit: 'C-301', status: 'Expected', time: '2:30 PM', kind: 'guest' },
  { name: 'Moses K.', unit: 'Service visit', status: 'Expected', time: '4:00 PM', kind: 'provider' },
]

const providers: { icon: IconName; title: string; text: string }[] = [
  { icon: 'tool', title: 'Electricians & repairs', text: 'Electrical, plumbing, carpentry, appliances and general maintenance.' },
  { icon: 'sparkles', title: 'Cleaning services', text: 'Home cleaning, deep cleaning, laundry, pest control and waste services.' },
  { icon: 'car', title: 'Transport & cabs', text: 'Airport transfers, drivers, cabs, vehicle hire and moving support.' },
  { icon: 'shield', title: 'Security services', text: 'Security teams, access support, locksmiths and emergency response.' },
]

export function HomePage({ session }: { session: Session | null }) {
  const [inviteOpen, setInviteOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [inviteSent, setInviteSent] = useState(false)
  const [reportSent, setReportSent] = useState(false)

  const openPortal = () => navigate(session ? `/app/${session.role}` : '/login/tenant')

  return (
    <div className="public-site security-home">
      <PublicNav session={session} />

      <main>
        <section className="security-hero section">
          <div className="container security-hero__grid">
            <div className="security-hero__copy">
              <span className="eyebrow"><Icon name="shield" size={15} /> Security-first property living</span>
              <h1>Know who is in your building. <span>Keep everyone connected.</span></h1>
              <p> MongaLets keeps management and security informed about residents, guests and service visits — while making everyday life simpler for tenants and clients.</p>
              <div className="security-hero__actions">
                <button className="button button--primary button--large" onClick={openPortal}>Open resident portal <Icon name="arrow-right" size={18} /></button>
                <button className="button button--secondary button--large" onClick={() => setInviteOpen(true)}>Invite a visitor <Icon name="user-plus" size={18} /></button>
              </div>
              <div className="security-proof"><span><Icon name="check" size={14} /></span><strong>Simple for residents.</strong><small>Clear for security. Accountable for management.</small></div>
            </div>

            <div className="security-hero__card">
              <div className="security-card-head"><div><small>Building security</small><strong>Live presence</strong></div><span className="live-chip"><i /> Live</span></div>
              <div className="presence-summary"><article><strong>42</strong><span>Inside now</span></article><article><strong>6</strong><span>Expected today</span></article><article><strong>3</strong><span>Service visits</span></article></div>
              <div className="presence-list">{presence.slice(0, 3).map((item) => <div className="presence-row" key={item.name}><span className={`presence-avatar presence-avatar--${item.kind}`}><Icon name={item.kind === 'provider' ? 'tool' : item.kind === 'guest' ? 'user' : 'home'} size={16} /></span><div><strong>{item.name}</strong><small>{item.unit}</small></div><span className={item.status === 'Inside' ? 'presence-status presence-status--inside' : 'presence-status'}>{item.status}<small>{item.time}</small></span></div>)}</div>
              <button className="security-card-link" onClick={openPortal}>View full presence log <Icon name="arrow-right" size={15} /></button>
            </div>
          </div>
        </section>

        <section className="security-focus section">
          <div className="container">
            <div className="section-heading section-heading--split security-heading">
              <div><span className="eyebrow">Just the essentials</span><h2>One calm system for security, access and resident needs.</h2></div>
              <p>We have reduced the public experience to the things people actually need: know who is coming, approve access, report a problem and find trusted help.</p>
            </div>
            <div className="security-feature-grid">
              <article className="security-feature security-feature--presence"><span className="feature-icon"><Icon name="users" size={22} /></span><small>01 · Building visibility</small><h3>Past, present & future presence</h3><p>Security can see who is currently inside, who has left, and who is expected next — with a clear history for accountability.</p><button onClick={openPortal}>Open presence log <Icon name="arrow-right" size={15} /></button></article>
              <article className="security-feature"><span className="feature-icon"><Icon name="key" size={22} /></span><small>02 · Visitor access</small><h3>Invite, share & approve</h3><p>Residents can invite someone themselves or approve an invitation. Security gets the right details before the visitor arrives.</p><button onClick={() => setInviteOpen(true)}>Create an invitation <Icon name="arrow-right" size={15} /></button></article>
              <article className="security-feature"><span className="feature-icon"><Icon name="camera" size={22} /></span><small>03 · Complaints & reports</small><h3>Report it with a photo</h3><p>Raise complaints, incidents or maintenance reports in a few taps. Add photos so the right person understands the issue immediately.</p><button onClick={() => setReportOpen(true)}>Raise a report <Icon name="arrow-right" size={15} /></button></article>
            </div>
          </div>
        </section>

        <section className="resident-flow section">
          <div className="container resident-flow__grid">
            <div><span className="eyebrow eyebrow--light">Resident convenience</span><h2>Less chasing. Fewer calls. Faster answers.</h2><p>Everything important starts with a simple action and stays visible to the people who need to respond.</p><div className="flow-list"><div><span>1</span><div><strong>Invite a person</strong><small>Set the date, time and purpose. Share or approve access.</small></div></div><div><span>2</span><div><strong>Raise a report</strong><small>Describe the issue, add photos and track the response.</small></div></div><div><span>3</span><div><strong>Find trusted services</strong><small>Choose from verified providers for everyday property needs.</small></div></div></div></div>
            <div className="resident-quick-card"><div className="quick-head"><span className="mini-avatar">AN</span><div><small>Good afternoon</small><strong>Amina · Unit A-204</strong></div><span className="secure-badge"><Icon name="shield" size={14} /> Secure</span></div><div className="quick-actions"><button onClick={() => setInviteOpen(true)}><Icon name="user-plus" size={21} /><strong>Invite</strong><small>Visitor or service visit</small></button><button onClick={() => setReportOpen(true)}><Icon name="camera" size={21} /><strong>Report</strong><small>Issue with photos</small></button><button onClick={openPortal}><Icon name="search" size={21} /><strong>Services</strong><small>Find trusted help</small></button></div><div className="quick-notice"><span><Icon name="bell" size={16} /></span><div><strong>Visitor approved</strong><small>Grace W. · Today at 2:30 PM</small></div><Icon name="check" size={15} /></div></div>
          </div>
        </section>

        <section className="providers-section section" id="services">
          <div className="container"><div className="section-heading section-heading--center"><span className="eyebrow">Trusted service providers</span><h2>Help for the things around your home.</h2><p>From a quick repair to a ride across town, residents can discover relevant services without leaving the property experience.</p></div><div className="provider-grid">{providers.map((provider) => <article key={provider.title}><span><Icon name={provider.icon} size={22} /></span><h3>{provider.title}</h3><p>{provider.text}</p><button onClick={openPortal}>Explore providers <Icon name="arrow-right" size={14} /></button></article>)}</div></div>
        </section>

        <section className="security-final section"><div className="container security-final__inner"><div><span className="eyebrow eyebrow--light">A simpler MongaLets</span><h2>Security sees the building. Residents feel the convenience.</h2><p>One shared record for access, presence, reports and service visits — without turning the homepage into a control room.</p></div><button className="button button--cream button--large" onClick={openPortal}>Enter MongaLets <Icon name="arrow-right" size={17} /></button></div></section>
      </main>

      {inviteOpen && <div className="simple-modal-backdrop" role="presentation"><div className="simple-modal"><button className="icon-button" onClick={() => setInviteOpen(false)} aria-label="Close"><Icon name="x" size={19} /></button>{inviteSent ? <div className="modal-success"><span><Icon name="check" size={25} /></span><h3>Invitation ready</h3><p>The visitor invitation has been prepared for sharing and approval.</p><button className="button button--primary" onClick={() => { setInviteSent(false); setInviteOpen(false) }}>Done</button></div> : <><span className="modal-icon"><Icon name="user-plus" size={22} /></span><h3>Invite a visitor</h3><p>Add a visitor or service provider and choose when they should be expected.</p><label>Name<input placeholder="Visitor name" /></label><label>Visit date<input type="date" /></label><label>Purpose<select><option>Visitor</option><option>Service visit</option><option>Delivery</option></select></label><button className="button button--primary button--full" onClick={() => setInviteSent(true)}>Create invitation <Icon name="arrow-right" size={16} /></button></>}</div></div>}
      {reportOpen && <div className="simple-modal-backdrop" role="presentation"><div className="simple-modal"><button className="icon-button" onClick={() => setReportOpen(false)} aria-label="Close"><Icon name="x" size={19} /></button>{reportSent ? <div className="modal-success"><span><Icon name="check" size={25} /></span><h3>Report submitted</h3><p>Your report is now visible to the responsible team.</p><button className="button button--primary" onClick={() => { setReportSent(false); setReportOpen(false) }}>Done</button></div> : <><span className="modal-icon"><Icon name="camera" size={22} /></span><h3>Raise a report</h3><p>Tell us what happened. You can attach photos to make the report clearer.</p><label>Category<select><option>Maintenance</option><option>Security</option><option>Noise / neighbour</option><option>Other</option></select></label><label>What happened?<textarea rows={4} placeholder="Describe the issue briefly..." /></label><label>Photos<input type="file" accept="image/*" multiple /></label><button className="button button--primary button--full" onClick={() => setReportSent(true)}>Submit report <Icon name="arrow-right" size={16} /></button></>}</div></div>}
    </div>
  )
}
