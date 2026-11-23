import { useState } from 'react'
import type { Role } from '../lib/types'
import { Icon } from '../components/Icon'
import { findCredential, updateVisit, useVisits } from '../lib/demoVisits'
import { TenantHome,TenantVisitors,TenantFamily,TenantServices,TenantReports } from './RoleTenantPages'
import { ProviderHome,ProviderJobs,ProviderServices,ProviderFinance,ProviderReviews } from './RoleProviderPages'
import { GuestHome,GuestAccess,GuestDetails,GuestGuide,GuestServices } from './RoleGuestPages'
import { TenantAccess,ProviderAccess } from './RoleAccessPages'
import { Management,Admin } from './RoleAdminPages'
import { RoleCalendar } from './RoleCalendar'

function Verify() {
 const [code,setCode]=useState(''),[queried,setQueried]=useState(false)
 const visits=useVisits()
 const match=queried?findCredential(code):null
 const visit=match&&'visit' in match?match.visit:undefined
 const action=(next:'Checked in'|'Checked out')=>{if(visit&&updateVisit(visit.id,next))setQueried(false)}
 return <div className="role-section-page">
  <div className="role-section-head"><div><span className="eyebrow">Security desk · Interactive demo</span><h1>Verify Access</h1><p>Look up the visitor's credential before recording gate entry or exit.</p></div></div>
  <section className="role-panel"><label className="ml-access-field"><span>Access code</span><div><Icon name="key" size={16}/><input autoComplete="off" value={code} onChange={e=>{setCode(e.target.value.toUpperCase());setQueried(false)}} placeholder="e.g. ML-GRACE-4931" onKeyDown={e=>{if(e.key==='Enter')setQueried(true)}}/></div></label><div className="role-action-grid"><button className="button button--primary" disabled={!code.trim()} onClick={()=>setQueried(true)}>Verify credential</button><button className="button button--secondary" onClick={()=>{setCode('');setQueried(false)}}>Clear</button></div>
  {queried&&<div role="status" className={`verify-result ${match?'valid':'invalid'}`}><Icon name={match?'check':'close'} size={20}/><div><strong>{match?'Demo credential found':'Credential not valid for entry'}</strong><span>{match?`${match.name} · ${match.status}`:'Unrecognized, pending, revoked or already checked-out credentials cannot be admitted.'}</span></div></div>}
  {visit&&<div className="role-action-grid">{visit.status==='Approved'&&<button className="button button--primary" onClick={()=>action('Checked in')}>Record check-in</button>}{visit.status==='Checked in'&&<button className="button button--primary" onClick={()=>action('Checked out')}>Record check-out</button>}</div>}
  <p className="demo-disclaimer">Manual verification works for browser-local sample visits. The camera, real QR scanning, hardware access, authorization and audit logs need a secure backend. Do not use this prototype to grant physical access.</p>
  </section>
  <section className="role-panel"><h2>Current demo visitors</h2><div className="role-list">{visits.filter(v=>v.status==='Checked in').length?visits.filter(v=>v.status==='Checked in').map(v=><button key={v.id} className="role-list-row" onClick={()=>{setCode(v.code);setQueried(true)}}><span className="role-list-icon role-tone-info"><Icon name="users" size={17}/></span><div><strong>{v.name}</strong><small>{v.code} · A5G</small></div><b className="role-status role-status--good">Inside</b></button>):<p>No visitors currently checked in to this demo.</p>}</div></section>
 </div>
}
function Profile({role}:{role:Role}){return <div className="role-section-page"><div className="role-section-head"><div><span className="eyebrow">Account</span><h1>My profile</h1><p>Use the account profile in the workspace sidebar to view or change your demo details.</p></div></div><section className="role-panel"><strong>{role} workspace</strong></section></div>}
export function RoleSection({role,section='overview'}:{role:Role;section?:string}) {
 if(role==='owner'){
  if(section==='overview')return <Management section="overview"/>
  if(section==='verify-access')return <Verify/>
  if(section==='profile')return <Profile role={role}/>
  if(section==='calendar')return <RoleCalendar role={role}/>
  return <Management section={section}/>
 }
 if(role==='admin'){
  if(section==='overview')return <Admin section="overview"/>
  if(section==='verify-access')return <Verify/>
  if(section==='profile')return <Profile role={role}/>
  if(section==='calendar')return <RoleCalendar role={role}/>
  return <Admin section={section}/>
 }
 if(role==='tenant'){
  if(section==='home'||section==='overview')return <TenantHome/>
  if(section==='my-access')return <TenantAccess/>
  if(section==='visitors')return <TenantVisitors/>
  if(section==='family')return <TenantFamily/>
  if(section==='services')return <TenantServices/>
  if(section==='my-reports'||section==='requests')return <TenantReports/>
  if(section==='calendar')return <RoleCalendar role={role}/>
  if(section==='profile')return <Profile role={role}/>
  return <TenantHome/>
 }
 if(role==='provider'){
  if(section==='overview')return <ProviderHome/>
  if(section==='my-jobs')return <ProviderJobs/>
  if(section==='schedule')return <RoleCalendar role={role}/>
  if(section==='access-pass')return <ProviderAccess/>
  if(section==='my-services')return <ProviderServices/>
  if(section==='finance')return <ProviderFinance/>
  if(section==='reviews')return <ProviderReviews/>
  if(section==='profile')return <Profile role={role}/>
  return <ProviderHome/>
 }
 if(role==='guest'){
  if(section==='home'||section==='overview')return <GuestHome/>
  if(section==='access-pass')return <GuestAccess/>
  if(section==='visit-details')return <GuestDetails/>
  if(section==='access-guide')return <GuestGuide/>
  if(section==='services')return <GuestServices/>
  if(section==='profile')return <Profile role={role}/>
  return <GuestHome/>
 }
 return <GuestHome/>
}
