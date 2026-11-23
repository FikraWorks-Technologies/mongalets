import { useEffect, useMemo, useState } from 'react'
import { Icon } from '../components/Icon'
import { Logo } from '../components/Logo'
import { clearSession } from '../lib/session'
import { navigate } from '../lib/router'
import { useVisits } from '../lib/demoVisits'
import type { Role, Session } from '../lib/types'
import { RoleSection } from './RoleSections'
import { RoleProfilePanel, getRoleProfile } from '../components/RoleProfilePanel'
import './workspace-polish.css'

const roleNames:Record<Role,string>={owner:'Management',admin:'Platform Admin',tenant:'Resident',provider:'Service Provider',guest:'Guest'}
const nav:Record<Role,[string,string][]>={
 owner:[['grid','Overview'],['key','Verify access'],['shield','Security'],['users','People & presence'],['key','Visitor access'],['tool','Requests'],['briefcase','Service providers'],['calendar','Calendar'],['wallet','Finance']],
 admin:[['grid','Overview'],['grid','Buildings'],['key','Verify access'],['shield','Security'],['users','People & presence'],['tool','Requests'],['briefcase','Service visits'],['briefcase','Service providers'],['star','Reviews'],['wallet','Finance'],['calendar','Calendar']],
 tenant:[['home','Home'],['key','My access'],['users','Visitors'],['users','Family'],['tool','My reports'],['briefcase','Services'],['tool','Requests'],['calendar','Calendar']],
 provider:[['grid','Overview'],['key','Access pass'],['tool','My jobs'],['calendar','Schedule'],['briefcase','My services'],['wallet','Finance'],['star','Reviews']],
 guest:[['home','Home'],['key','Access pass'],['calendar','Visit details'],['shield','Access guide'],['briefcase','Services']]
}
const accessLabels=new Set(['Verify access','My access','Access pass','Visitor access'])
const slug=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-')
export function RoleWorkspacePage({role,section='overview',session}:{role:Role;section?:string;session:Session}){
 const [mobileOpen,setMobileOpen]=useState(false)
 const [searchOpen,setSearchOpen]=useState(false)
 const [notificationsOpen,setNotificationsOpen]=useState(false)
 const [query,setQuery]=useState('')
 const profile=getRoleProfile(session)
 const initials=useMemo(()=>session.name.split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase(),[session.name])
 const visits=useVisits()
 const pending=visits.filter(v=>v.status==='Pending').length
 const items=nav[role]
 const active=items.find(([,label])=>slug(label)===section)?.[1]||(section==='profile'?'My profile':items[0][1])
 const go=(label:string)=>{navigate(label===items[0][1]?`/app/${role}`:`/app/${role}/${slug(label)}`);setMobileOpen(false);setSearchOpen(false);setNotificationsOpen(false);setQuery('')}
 const profileGo=()=>{navigate(`/app/${role}/profile`);setMobileOpen(false);setSearchOpen(false);setNotificationsOpen(false)}
 const filtered=items.filter(([,label])=>label.toLowerCase().includes(query.toLowerCase().trim()))
 const notificationTarget=role==='tenant'?'Visitors':role==='owner'?'Visitor access':role==='admin'?'Verify access':items[0][1]
 useEffect(()=>{const esc=(event:KeyboardEvent)=>{if(event.key==='Escape'){setMobileOpen(false);setSearchOpen(false);setNotificationsOpen(false)}};window.addEventListener('keydown',esc);return()=>window.removeEventListener('keydown',esc)},[])
 useEffect(()=>{setMobileOpen(false);setSearchOpen(false);setNotificationsOpen(false)},[role])
 const page=section==='profile'?<RoleProfilePanel role={role} session={session}/>:<RoleSection role={role} section={section}/>
 const showPending=role==='tenant'||role==='owner'||role==='admin'
 return <div className={`role-workspace role-workspace-${role}`}>
  {mobileOpen&&<button className="workspace-mobile-scrim" aria-label="Close menu" onClick={()=>setMobileOpen(false)}/>}
  <aside className={mobileOpen?'is-open':''} aria-label={roleNames[role]+' navigation'}>
   <div className="role-workspace-brand"><button aria-label="MongaLets homepage" onClick={()=>navigate('/')}><Logo inverse/></button><button className="icon-button role-mobile-close" onClick={()=>setMobileOpen(false)} aria-label="Close navigation"><Icon name="close"/></button></div>
   <div className="role-workspace-badge"><span><Icon name={role==='provider'?'tool':role==='guest'?'key':role==='tenant'?'home':'shield'} size={17}/></span><div><small>Workspace</small><strong>{roleNames[role]}</strong></div></div>
   <nav aria-label="Workspace"><small>Workspace</small>{items.map(([icon,label])=><button key={label} className={`${label===active?'active ':''}${accessLabels.has(label)?'access-nav-item':''}`} onClick={()=>go(label)} aria-current={label===active?'page':undefined}><Icon name={icon} size={17}/><span>{label}</span>{accessLabels.has(label)&&<b className="access-nav-badge">ACCESS</b>}</button>)}<small>Account</small><button className={active==='My profile'?'active':''} onClick={profileGo}><Icon name="users" size={17}/><span>My profile</span></button></nav>
   <div className="role-workspace-footer"><button onClick={()=>{clearSession();navigate('/login')}}><Icon name="users" size={16}/> Switch role</button><button onClick={()=>{clearSession();navigate('/login')}}><Icon name="logout" size={16}/> Sign out</button><button className="role-user-mini" onClick={profileGo}>{profile.photo?<img src={profile.photo} alt=""/>:<span>{initials}</span>}<section><strong>{session.name}</strong><small>{session.email}</small></section><Icon name="chevron-down" size={14}/></button></div>
  </aside>
  <div className="role-workspace-main"><header>
   <button className="icon-button role-mobile-menu" onClick={()=>setMobileOpen(true)} aria-label="Open navigation" aria-expanded={mobileOpen}><Icon name="menu"/></button>
   <div className="role-crumb"><span>MongaLets</span><Icon name="arrow-right" size={12}/><strong>{active}</strong></div>
   <div className="role-header-actions">
    <div className="workspace-action-wrap">
     <button className="role-search" onClick={()=>{setSearchOpen(v=>!v);setNotificationsOpen(false)}} aria-label="Search workspace pages" aria-expanded={searchOpen}><Icon name="search" size={15}/><span>Search workspace...</span></button>
     {searchOpen&&<div className="workspace-popover workspace-search-panel"><label className="workspace-search-input"><Icon name="search" size={16}/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find a page..." aria-label="Search workspace pages"/></label><div className="workspace-search-results">{filtered.length?filtered.map(([icon,label])=><button key={label} onClick={()=>go(label)}><Icon name={icon} size={16}/><span>{label}</span><Icon name="arrow-right" size={13}/></button>):<p>No matching pages in this workspace.</p>}</div></div>}
    </div>
    <div className="workspace-action-wrap"><button className="icon-button icon-button--bordered" onClick={()=>{setNotificationsOpen(v=>!v);setSearchOpen(false)}} aria-label="Notifications" aria-expanded={notificationsOpen}><Icon name="bell" size={17}/>{showPending&&pending>0&&<span className="workspace-notification-dot"/>}</button>
     {notificationsOpen&&<div className="workspace-popover workspace-notification-panel"><h3>Activity</h3>{showPending?<><p>{pending? `${pending} visitor request(s) awaiting resident review in this browser.`:'There are no pending visitor requests in this browser.'}</p><button className="button button--secondary button--small" onClick={()=>go(notificationTarget)}>View {notificationTarget.toLowerCase()}</button></>:<p>No new workspace alerts in the demo.</p>}<small>Demo activity only — real push, email and SMS notifications are not connected.</small></div>}
    </div>
    <button className="role-avatar-button" onClick={profileGo} aria-label="Open profile">{profile.photo?<img src={profile.photo} alt={session.name}/>:<span>{initials}</span>}</button>
   </div>
  </header><main>{page}</main></div>
 </div>
}
