import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Icon } from '../components/Icon'
import type { Role } from '../lib/types'

type AccessKind = 'tenant' | 'companion' | 'guest' | 'provider'
type AccessState = 'active' | 'inside' | 'exited' | 'expired'
type AccessRecord = {
  code: string
  kind: AccessKind
  name: string
  phone?: string
  property: string
  unit?: string
  state: AccessState
  groupId?: string
  groupAdults?: number
  groupMinors?: number
  visit?: string
  purpose?: string
  expiresAt?: string
  parentCode?: string
  createdAt: string
}

type Store = { records: AccessRecord[]; events: { code: string; action: 'entry' | 'exit'; at: string }[] }
const STORE_KEY = 'mongalets.access.v2'
const TENANT_CODE = 'ML-A5G-7284'
const DEMO_GUEST = 'ML-GRACE-4931'
const DEMO_PROVIDER = 'ML-PROV-5820'
const QR = (value: string) => `https://api.qrserver.com/v1/create-qr-code/?size=360x360&margin=10&data=${encodeURIComponent(value)}`
const now = () => new Date().toISOString()
const load = (): Store => {
  try { const raw = localStorage.getItem(STORE_KEY); if (raw) return JSON.parse(raw) as Store } catch {}
  const base: Store = { records: [
    { code: TENANT_CODE, kind: 'tenant', name: 'Amina Njoki', property: 'Building A', unit: 'A5G', state: 'active', createdAt: now() },
    { code: DEMO_GUEST, kind: 'guest', name: 'Grace Wanjiku', property: 'Building A', unit: 'A5G', state: 'active', groupId: 'VIS-GRACE', groupAdults: 1, groupMinors: 1, visit: 'Today · 2:30–5:00 PM', createdAt: now() },
    { code: DEMO_PROVIDER, kind: 'provider', name: 'Moses K.', property: 'Building A', unit: 'A5G', state: 'active', purpose: 'Plumbing repair', visit: 'Today · 4:00–5:00 PM', expiresAt: '5:00 PM today', createdAt: now() },
  ], events: [] }
  try { localStorage.setItem(STORE_KEY, JSON.stringify(base)) } catch {}
  return base
}
const save = (store: Store) => { try { localStorage.setItem(STORE_KEY, JSON.stringify(store)) } catch {} }
const code = (prefix: string, seed: string) => `ML-${prefix}-${seed.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 6)}`

function Layout({ eyebrow, title, text, children, action }: { eyebrow: string; title: string; text: string; children: ReactNode; action?: ReactNode }) {
  return <div className="role-section-page"><div className="role-section-head"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div>{action}</div>{children}</div>
}
function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return <section className="role-panel"><div className="role-panel-head"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div></div>{children}</section>
}
function CodeCard({ record }: { record: AccessRecord }) {
  const active = record.state !== 'expired' && record.state !== 'exited'
  return <article className={`access-code-card ${active ? '' : 'is-disabled'}`}><div className="access-code-card__top"><div><span className="eyebrow">{record.kind === 'tenant' ? 'Permanent tenant access' : 'Personal access credential'}</span><strong>{record.code}</strong></div><span className={`access-live ${active ? 'good' : 'muted'}`}>{active ? record.state === 'inside' ? 'Inside' : 'Active' : 'Exited'}</span></div><img src={QR(record.code)} alt={`QR code for ${record.code}`} /><small>{record.kind === 'tenant' ? 'Permanent identity. Access is active only while the tenant is checked in.' : 'Present this same QR/code at entry and exit. Never share it with another adult.'}</small></article>
}
function StoreRefresh({ onChange }: { onChange: (s: Store) => void }) {
  useEffect(() => { const fn = () => onChange(load()); window.addEventListener('storage', fn); return () => window.removeEventListener('storage', fn) }, [onChange])
  return null
}
function Scanner({ onResult }: { onResult: (value: string) => void }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('Camera scanning is optional; manual code entry is always available.')
  useEffect(() => { if (!open) return; let stream: MediaStream | undefined; let timer: number | undefined; (async () => { try { if (!navigator.mediaDevices?.getUserMedia) throw new Error('camera unavailable'); stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }); const video = document.getElementById('ml-camera') as HTMLVideoElement | null; if (video) video.srcObject = stream; const Detector = (window as any).BarcodeDetector; if (!Detector) { setMessage('Camera opened, but this browser does not expose QR detection. Use manual code entry below.'); return } const detector = new Detector({ formats: ['qr_code'] }); const tick = async () => { if (!open) return; try { if (video?.readyState && video.readyState >= 2) { const found = await detector.detect(video); if (found?.[0]?.rawValue) { onResult(found[0].rawValue); setOpen(false); return } } } catch {} timer = window.setTimeout(tick, 500) }; tick() } catch { setMessage('Camera permission is unavailable. Use manual code entry below.') } })(); return () => { if (timer) window.clearTimeout(timer); stream?.getTracks().forEach(t => t.stop()) } }, [open, onResult])
  return <div className="scanner"><div className="scanner-preview">{open ? <video id="ml-camera" autoPlay playsInline muted /> : <><span><Icon name="camera" size={28} /></span><p>{message}</p></>}</div><button className="button button--secondary button--small" onClick={() => setOpen(x => !x)}>{open ? 'Stop scanner' : 'Scan QR code'}</button></div>
}
function TenantSection() {
  const [store, setStore] = useState<Store>(load)
  const tenant = store.records.find(x => x.code === TENANT_CODE)!
  const [adults, setAdults] = useState<{ name: string; phone: string }[]>([])
  const [minors, setMinors] = useState(0)
  const [message, setMessage] = useState('')
  const total = 1 + adults.length + minors
  const prepare = () => {
    const groupId = `GRP-${Date.now()}`
    const records = store.records.filter(x => x.groupId !== groupId)
    const created = adults.map((person, index): AccessRecord => ({ code: code(`C${index + 1}`, `${person.name}${Date.now()}`), kind: 'companion', name: person.name || `Adult ${index + 1}`, phone: person.phone, property: tenant.property, unit: tenant.unit, state: 'active', groupId, groupAdults: adults.length + 1, groupMinors: minors, parentCode: TENANT_CODE, visit: 'Current arrival · valid until tenant exit', createdAt: now() }))
    const next = { ...store, records: [...records, ...created] }
    save(next); setStore(next); setMessage(`${created.length} adult companion credential${created.length === 1 ? '' : 's'} created. SMS/QR delivery is queued in this frontend demo.`)
  }
  const exit = () => { const next = { ...store, records: store.records.map(x => x.code === TENANT_CODE || x.parentCode === TENANT_CODE ? { ...x, state: 'exited' as AccessState } : x), events: [...store.events, { code: TENANT_CODE, action: 'exit' as const, at: now() }] }; save(next); setStore(next); setMessage('Tenant and linked companion access have been deactivated for this arrival.') }
  const reactivate = () => { const next = { ...store, records: store.records.map(x => x.code === TENANT_CODE ? { ...x, state: 'active' as AccessState, property: 'Another MongaLets-enabled property' } : x) }; save(next); setStore(next); setMessage('Permanent tenant identity reactivated at the new MongaLets-enabled property.') }
  return <Layout eyebrow="My identity & access" title="My access" text="Your tenant code is a permanent identity credential. It can be activated at a MongaLets-enabled property and deactivated on exit."><StoreRefresh onChange={setStore} /><div className="access-identity-grid"><div className="tenant-id-card"><div className="tenant-profile"><div className="profile-photo">AN</div><div><span className="eyebrow">Verified tenant</span><h2>{tenant.name}</h2><p>{tenant.property} · Floor 5 · Unit {tenant.unit}</p></div></div><div className="tenant-details"><span>Permanent tenant code</span><strong>{tenant.code}</strong><small>The code stays attached to the tenant identity when the tenant moves between MongaLets-enabled properties.</small></div><CodeCard record={tenant} /></div><Panel title="Arriving with others" subtitle="Declare adults before arrival. Each adult gets an individual credential. Minors remain attached to the group and never receive their own code."><div className="role-form-grid">{adults.map((adult, i) => <div className="role-form-row" key={i}><input value={adult.name} placeholder="Adult full name" onChange={e => setAdults(a => a.map((x, n) => n === i ? { ...x, name: e.target.value } : x))} /><input value={adult.phone} placeholder="Phone for SMS" onChange={e => setAdults(a => a.map((x, n) => n === i ? { ...x, phone: e.target.value } : x))} /><button className="button button--secondary button--small" onClick={() => setAdults(a => a.filter((_, n) => n !== i))}>Remove</button></div>)}</div><button className="button button--secondary button--small" onClick={() => setAdults(a => [...a, { name: '', phone: '' }])}>+ Add adult</button><div className="group-counter"><button onClick={() => setMinors(Math.max(0, minors - 1))}>−</button><strong>{minors}</strong><button onClick={() => setMinors(minors + 1)}>+</button><span>minors</span></div><div className="group-preview"><Icon name="users" size={18} /><div><strong>Group at entry: {total} people</strong><small>Security sees the declared group count when the tenant code is scanned. Each adult companion can then use their own code for an individual exit record.</small></div></div><button className="button button--primary button--full" disabled={adults.length === 0} onClick={prepare}>Create adult access codes</button>{message && <div className="success-note"><Icon name="check" size={16} /> {message}</div>}</Panel></div><Panel title="Arrival lifecycle"><div className="role-grid-2"><div><strong>Current status</strong><p>{tenant.state === 'exited' ? 'Exited / inactive' : tenant.state === 'inside' ? 'Inside' : 'Active credential'}</p></div><div className="role-button-stack"><button className="button button--secondary" onClick={exit} disabled={tenant.state === 'exited'}>Record tenant exit</button><button className="button button--secondary" onClick={reactivate}>Reactivate at another property</button></div></div></Panel></Layout>
}
function GuestSection({ section }: { section: string }) {
  const [store, setStore] = useState<Store>(load); const [minors, setMinors] = useState(1); const [confirmed, setConfirmed] = useState(false); const guest = store.records.find(x => x.code === DEMO_GUEST)!
  const confirm = () => { const next = { ...store, records: store.records.map(x => x.code === DEMO_GUEST ? { ...x, groupMinors: minors } : x) }; save(next); setStore(next); setConfirmed(true) }
  if (section.includes('detail')) return <Layout eyebrow="Approved visit" title="Your visit" text="Your visit is temporary and expires with the approved window."><div className="role-stats"><article><small>Status</small><strong>Approved</strong><span>by tenant</span></article><article><small>Arrival</small><strong>2:30 PM</strong><span>today</span></article><article><small>Ends</small><strong>5:00 PM</strong><span>today</span></article><article><small>Group</small><strong>1 + {guest.groupMinors || 0}</strong><span>adult + minors</span></article></div><Panel title="Visit information"><p>Host: Amina Njoki · Unit A5G</p><p>Entry: Main entrance · Show your personal QR/code to security.</p></Panel></Layout>
  if (section.includes('guide')) return <Layout eyebrow="Arrival made simple" title="Access guide" text="The same personal adult credential is used for entry and exit."><div className="step-grid"><article><b>1</b><h3>Receive your code</h3><p>Adult guests receive a personal code and QR link after approval.</p></article><article><b>2</b><h3>Enter</h3><p>Security verifies the approved visit and records entry.</p></article><article><b>3</b><h3>Exit</h3><p>Use the same code so your individual departure is recorded.</p></article></div></Layout>
  return <Layout eyebrow="Your approved visit" title="Access pass" text="Adult guests receive their own credential. Minors are declared on the adult guest's approved visit and do not receive individual codes."><StoreRefresh onChange={setStore} /><div className="access-pass-layout"><CodeCard record={guest} /><Panel title="Accompanying minors"><div className="group-counter"><button onClick={() => setMinors(Math.max(0, minors - 1))}>−</button><strong>{minors}</strong><button onClick={() => setMinors(minors + 1)}>+</button><span>minors</span></div><button className="button button--primary button--full" onClick={confirm}>Confirm visit details</button>{confirmed && <div className="success-note"><Icon name="check" size={16} /> Visit updated: 1 adult + {minors} minor{minors === 1 ? '' : 's'}.</div>}<div className="role-callout"><Icon name="key" size={18} /><div><strong>Entry and exit use the same code.</strong><span>Do not share the adult credential. Minors remain attached to your visit.</span></div></div></Panel></div></Layout>
}
function ProviderSection({ section }: { section: string }) {
  const [store, setStore] = useState<Store>(load); const provider = store.records.find(x => x.code === DEMO_PROVIDER)!
  if (section.includes('job')) return <Layout eyebrow="Provider workspace" title="My jobs" text="Only jobs assigned to the provider are visible."><Panel title="Assigned work"><div className="role-list"><div className="role-list-row"><span className="role-list-icon role-tone-good"><Icon name="tool" size={17} /></span><div><strong>Plumbing repair · Unit A5G</strong><small>Today · 4:00–5:00 PM · access approved</small></div><b className="role-status role-status--good">Confirmed</b></div></div></Panel></Layout>
  return <Layout eyebrow="Approved service visit" title="Access pass" text="This credential is tied to one approved job, client/unit and access window. It expires when the approved visit ends."><StoreRefresh onChange={setStore} /><div className="access-pass-layout"><CodeCard record={provider} /><Panel title="Visit details"><div className="visit-detail-list"><span>Client / unit</span><strong>{provider.unit}</strong><span>Purpose</span><strong>{provider.purpose}</strong><span>Access window</span><strong>{provider.visit}</strong><span>Entry</span><strong>Main gate · security verification</strong></div><div className="role-callout"><Icon name="shield" size={18} /><div><strong>Visit-only access</strong><span>Security sees the job information required for the access decision, not resident movement history.</span></div></div></Panel></div></Layout>
}
function SecuritySection({ section }: { section: string }) {
  const [store, setStore] = useState<Store>(load); const [input, setInput] = useState(''); const [result, setResult] = useState<AccessRecord | null>(null); const [error, setError] = useState('')
  const verify = (value: string) => { const clean = value.trim().toUpperCase(); const found = load().records.find(x => x.code.toUpperCase() === clean); setStore(load()); setInput(clean); setError(found ? '' : 'Code not recognised or no longer active. Do not admit until the credential is confirmed.'); setResult(found && found.state !== 'expired' && found.state !== 'exited' ? found : null) }
  const toggle = (action: 'entry' | 'exit') => { if (!result) return; const next: Store = { ...store, records: store.records.map(x => x.code === result.code ? { ...x, state: action === 'entry' ? 'inside' : 'exited' } : x), events: [...store.events, { code: result.code, action, at: now() }] }; save(next); setStore(next); setResult(next.records.find(x => x.code === result.code) || null) }
  if (section.includes('people')) { const inside = store.records.filter(x => x.state === 'inside'); return <Layout eyebrow="Restricted · Security" title="People & presence" text="Security can see current authorised presence and the minimum identity needed for access decisions."><Panel title="Currently inside"><div className="role-list">{inside.length ? inside.map(x => <div className="role-list-row" key={x.code}><span className="role-list-icon role-tone-good"><Icon name="shield" size={17} /></span><div><strong>{x.name}</strong><small>{x.code} · {x.property} · {x.unit || '—'}</small></div><b className="role-status role-status--good">Inside</b></div>) : <p>No access credentials are currently recorded as inside.</p>}</div></Panel></Layout> }
  if (section.includes('visitor')) return <Layout eyebrow="Access control" title="Visitor access" text="Approved guests and service visits receive temporary credentials that can be verified here."><Panel title="Verification desk"><p>Use Verify access for every arrival and departure. Approval is not the same thing as entry: entry and exit must both be recorded.</p></Panel></Layout>
  return <Layout eyebrow="Security desk" title="Verify access" text="Scan a QR code or enter a credential. The result is intentionally limited to the information security needs to make the entry/exit decision."><StoreRefresh onChange={setStore} /><div className="verify-grid"><Panel title="Scan or enter code"><Scanner onResult={verify} /><div className="code-entry"><input value={input} onChange={e => setInput(e.target.value.toUpperCase())} placeholder="e.g. ML-A5G-7284" onKeyDown={e => e.key === 'Enter' && verify(input)} /><button className="button button--primary" onClick={() => verify(input)}>Verify</button></div>{error && <div className="verify-result invalid"><Icon name="close" size={22} /><strong>Access denied</strong><span>{error}</span></div>}</Panel><Panel title="Verification result">{!result ? <div className="verify-empty"><Icon name="shield" size={25} /><strong>Ready to verify</strong><span>Scan a QR code or enter a code.</span></div> : <div className="verify-result valid"><Icon name="check" size={24} /><strong>Credential valid</strong><span>{result.name} · {result.property} · {result.unit || '—'}</span><div className="verify-detail"><b>Type</b><span>{result.kind}</span><b>Visit / purpose</b><span>{result.visit || result.purpose || 'Permanent tenant access'}</span>{result.groupId && <><b>Group</b><span>{result.groupAdults || 1} adult{(result.groupAdults || 1) === 1 ? '' : 's'} + {result.groupMinors || 0} minor{(result.groupMinors || 0) === 1 ? '' : 's'}</span></>}</div><div className="role-button-stack"><button className="button button--primary button--full" disabled={result.state === 'inside'} onClick={() => toggle('entry')}>Record entry</button><button className="button button--secondary button--full" disabled={result.state !== 'inside'} onClick={() => toggle('exit')}>Record exit</button></div><small>Current state: {result.state}</small></div>}</Panel></div></Layout>
}
function ManagementSection({ role, section, onNavigate }: { role: Role; section: string; onNavigate: (label: string) => void }) {
  if (section.includes('verify') || section.includes('people') || section.includes('visitor')) return <SecuritySection section={section} />
  if (section.includes('security')) return <Layout eyebrow={role === 'admin' ? 'Security operations' : 'Management · Security'} title="Building security" text="A single access desk for arrivals, exits, visitor approvals and service visits."><div className="role-stats"><article><small>Access model</small><strong>Credential-first</strong><span>identity separated from access</span></article><article><small>Entry</small><strong>QR + code</strong><span>manual fallback available</span></article><article><small>Exit</small><strong>Same credential</strong><span>individual exit record</span></article><article><small>Privacy</small><strong>Minimum</strong><span>decision-relevant information</span></article></div><Panel title="Security actions"><div className="role-button-stack"><button className="button button--primary" onClick={() => onNavigate('Verify access')}>Open Verify access</button><button className="button button--secondary" onClick={() => onNavigate('People & presence')}>View People & presence</button></div></Panel></Layout>
  return <Layout eyebrow="Management" title="Operations" text="Access controls are separated from resident, guest and provider identities."><Panel title="Access workflow"><p>Tenant identity → declared group → individual adult credentials → security verification → entry/exit event.</p><p>Guest approval and provider jobs create temporary credentials with expiry. Minors never receive individual credentials.</p></Panel></Layout>
}

export function RoleSection({ role, section, onNavigate }: { role: Role; section: string; onNavigate: (label: string) => void }) {
  const key = section.toLowerCase()
  if (role === 'tenant') return <TenantSection />
  if (role === 'guest') return <GuestSection section={key} />
  if (role === 'provider') return <ProviderSection section={key} />
  return <ManagementSection role={role} section={key} onNavigate={onNavigate} />
}
