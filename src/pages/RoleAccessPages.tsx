import { useState } from 'react'
import { Modal } from '../components/Modal'
import { navigate } from '../lib/router'
const maps=(q:string)=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
const qr=(code:string,size=300)=>`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(code)}`
export function TenantAccess(){
 const code='ML-A5G-7284',[open,setOpen]=useState(false)
 return <div className="role-section-page"><div className="role-section-head"><div><span className="eyebrow">Resident access · Sample only</span><h1>My Access</h1><p>Demonstration of a permanent resident pass and family access allocation.</p></div></div>
 <section className="access-code-card"><span className="eyebrow">Demo permanent credential</span><strong>{code}</strong><img src={qr(code)} alt="Sample resident QR code" loading="lazy"/><small>Riverside Apartments · Building A · A5G</small><div className="role-action-grid"><button className="button button--primary" onClick={()=>setOpen(true)}>Expand QR</button><a className="button button--secondary" href={maps('Riverside Apartments Nairobi')} target="_blank" rel="noreferrer">Directions</a></div></section>
 <section className="role-panel"><div className="role-panel-head"><div><span className="eyebrow">Household allocation</span><h2>Accompanying members</h2><p>Manage a maximum of 10 permanent household members.</p></div><button className="button button--primary" onClick={()=>navigate('/app/tenant/family')}>Manage family</button></div><p>Every adult should have an individual credential in production. Minors remain linked to their guardian.</p></section>
 <p className="demo-disclaimer">This QR is for prototype demonstration only. Production passes require revocation, expiry, cryptographic protection, server-side enforcement and hardware access integration.</p>
 <Modal open={open} title="Sample resident QR" eyebrow="Apartment A5G" onClose={()=>setOpen(false)}><img className="modal-qr" src={qr(code,340)} alt="Expanded sample resident QR code"/><p>{code} · Demo credential only</p></Modal>
 </div>
}
export function ProviderAccess(){
 const code='ML-PROV-5820',[open,setOpen]=useState(false)
 return <div className="role-section-page"><div className="role-section-head"><div><span className="eyebrow">Provider access · Sample</span><h1>Access Pass</h1><p>Show a property-specific pass only during a confirmed service visit.</p></div></div>
 <section className="access-code-card"><span className="eyebrow">Demo service visit credential</span><strong>{code}</strong><img src={qr(code)} alt="Sample service provider QR" loading="lazy"/><small>Riverside Apartments · A5G · Amina Njoki · Sample appointment</small><div className="role-action-grid"><button className="button button--primary" onClick={()=>setOpen(true)}>Expand QR</button><a className="button button--secondary" href={maps('Riverside Apartments Nairobi')} target="_blank" rel="noreferrer">Directions</a></div></section><p className="demo-disclaimer">This pass is illustrative, not a usable credential for building access. Production passes must be generated and validated server-side.</p>
 <Modal open={open} title="Sample provider QR" onClose={()=>setOpen(false)}><img className="modal-qr" src={qr(code,340)} alt="Expanded provider demo QR"/></Modal></div>
}
