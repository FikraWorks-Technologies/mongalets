import { useState } from 'react'
import { Icon } from '../components/Icon'
import { addVisit } from '../lib/demoVisits'
import './visitor-invite.css'

const localToday = () => {
  const d = new Date()
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-')
}
const validPhone = (phone: string) => /^(?:\+?254|0)\s?[17]\d{8}$/.test(phone.replace(/[\s-]/g, ''))

export function VisitorInvitePage({ tenantCode }: { tenantCode: string }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState(localToday())
  const [time, setTime] = useState('')
  const [purpose, setPurpose] = useState('Visiting resident')
  const [minors, setMinors] = useState(0)
  const [reference, setReference] = useState('')
  const [error, setError] = useState('')
  const accepted = ['a5g-riverside', 'ml-a5g-7284'].includes(tenantCode.toLowerCase())
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim() || name.trim().length < 3) { setError('Enter your full name.'); return }
    if (!validPhone(phone)) { setError('Enter a valid Kenyan mobile number (07, 01 or +254).'); return }
    if (date < localToday() || !time) { setError('Choose a valid future arrival date and time.'); return }
    const visit = addVisit({ name: name.trim(), phone: phone.replace(/\s/g, ''), date, time, minors, purpose: purpose.trim() || 'Visiting resident' }, 'Visitor')
    setReference(visit.code)
    setError('')
  }
  return <div className="public-invite"><div className="public-invite-card">
    <div className="public-invite-brand"><span>ML</span><div><strong>MongaLets</strong><small>Visitor request · interactive demo</small></div></div>
    {!accepted ? <div className="invite-success"><Icon name="alert" size={28}/><h1>Invitation link not recognised</h1><p>Ask your resident to share a fresh invitation link.</p><a className="button button--secondary" href="/">Back to MongaLets</a></div> : reference ? <div className="invite-success" role="status"><Icon name="check" size={28}/><h1>Request submitted</h1><p>Your visit is awaiting resident approval. Do not travel on the assumption that access is granted.</p><small>Demo reference: {reference}</small><p className="demo-disclaimer">This is a browser-local prototype: real SMS OTP, resident notifications and cross-device syncing require a connected backend.</p></div> : <>
      <div className="public-invite-hero"><span className="eyebrow">Riverside Apartments · A5G</span><h1>Tell us about your visit</h1><p>Send your details to request resident approval before arriving.</p></div>
      <form onSubmit={submit}>
        <div className="ml-form-grid">
          <label className="ml-access-field"><span>Full name *</span><div><Icon name="users" size={17}/><input required autoComplete="name" minLength={3} value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name"/></div></label>
          <label className="ml-access-field"><span>Mobile number *</span><div><Icon name="phone" size={17}/><input required autoComplete="tel" type="tel" inputMode="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="0712 345 678"/></div></label>
          <label className="ml-access-field"><span>Visit date *</span><div><Icon name="calendar" size={17}/><input required aria-label="Visit date" type="date" min={localToday()} value={date} onChange={e=>setDate(e.target.value)}/></div></label>
          <label className="ml-access-field"><span>Arrival time *</span><div><Icon name="calendar" size={17}/><input required aria-label="Arrival time" type="time" value={time} onChange={e=>setTime(e.target.value)}/></div></label>
          <label className="ml-access-field"><span>Purpose</span><div><Icon name="grid" size={17}/><input value={purpose} maxLength={120} onChange={e=>setPurpose(e.target.value)}/></div></label>
        </div>
        <div className="group-counter"><button type="button" aria-label="Remove minor" disabled={minors===0} onClick={()=>setMinors(v=>Math.max(0,v-1))}>−</button><strong aria-live="polite">{minors}</strong><button type="button" aria-label="Add minor" disabled={minors>=10} onClick={()=>setMinors(v=>Math.min(10,v+1))}>+</button><span>accompanying minors</span></div>
        <div className="role-callout"><Icon name="shield" size={18}/><div><strong>Access requires resident approval</strong><span>Minors stay linked to their accompanying adult. No live OTP is issued in this demo.</span></div></div>
        {error&&<p role="alert" className="form-error">{error}</p>}
        <button type="submit" className="button button--primary button--full">Request visit approval</button>
      </form>
    </>}
  </div></div>
}
