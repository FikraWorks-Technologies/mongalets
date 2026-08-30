import { useMemo, useState } from 'react'
import { Icon } from '../components/Icon'
import { Logo } from '../components/Logo'
import { clearSession } from '../lib/session'
import { navigate } from '../lib/router'
import type { Role, Session } from '../lib/types'
import { RoleSection } from './RoleSections'

const roleNames: Record<Role, string> = { owner: 'Management', admin: 'Security admin', tenant: 'Resident', provider: 'Service provider', guest: 'Guest' }
const nav: Record<Role, [string, string][]> = {
  owner: [['grid','Overview'],['shield','Security'],['users','People & presence'],['key','Visitor access'],['tool','Requests'],['briefcase','Service providers'],['calendar','Calendar']],
  admin: [['grid','Overview'],['shield','Security'],['users','People & presence'],['key','Visitor access'],['tool','Requests'],['briefcase','Service providers'],['calendar','Calendar']],
  tenant: [['grid','Home'],['key','Visitors'],['tool','My reports'],['briefcase','Services'],['calendar','Calendar']],
  provider: [['grid','Overview'],['tool','My jobs'],['calendar','Schedule'],['key','Access visits'],['briefcase','My services']],
  guest: [['grid','Home'],['key','My visit'],['calendar','Visit details'],['shield','Access guide'],['briefcase','Services']],
}

export function RoleWorkspacePage({ role, section, session }: { role: Role; section: string; session: Session }) {
  const [open, setOpen] = useState(false)
  const initials = useMemo(() => session.name.split(' ').map(x => x[0]).slice(0,2).join('').toUpperCase(), [session.name])
  const items = nav[role]
  const active = items.find(([, label]) => label.toLowerCase().replace(/[^a-z0-9]+/g,'-') === section)?.[1] || items[0][1]
  const go = (label: string) => { if (label === items[0][1]) navigate(`/app/${role}`); else navigate(`/app/${role}/${label.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`); setOpen(false) }
  return <div className={`role-workspace role-workspace-${role}`}>
    <aside className={open ? 'is-open' : ''}>
      <div className="role-workspace-brand"><button onClick={() => navigate('/')}><Logo inverse /></button><button className="icon-button role-mobile-close" onClick={() => setOpen(false)}><Icon name="close" /></button></div>
      <div className="role-workspace-badge"><span><Icon name={role === 'provider' ? 'tool' : role === 'guest' ? 'key' : role === 'tenant' ? 'home' : 'shield'} size={17} /></span><div><small>Workspace</small><strong>{roleNames[role]}</strong></div></div>
      <nav><small>Workspace</small>{items.map(([icon,label]) => <button key={label} className={label === active ? 'active' : ''} onClick={() => go(label)}><Icon name={icon as any} size={17}/><span>{label}</span>{(label === 'My reports' || label === 'Requests' || label === 'Visitor access') && <b>2</b>}</button>)}</nav>
      <div className="role-workspace-footer"><button onClick={() => navigate('/login')}><Icon name="users" size={16}/> Switch role</button><button onClick={() => { clearSession(); navigate('/login') }}><Icon name="logout" size={16}/> Sign out</button><div><span>{initials}</span><section><strong>{session.name}</strong><small>{session.email}</small></section></div></div>
    </aside>
    <div className="role-workspace-main">
      <header><button className="icon-button role-mobile-menu" onClick={() => setOpen(true)}><Icon name="menu"/></button><div className="role-crumb"><span>MongaLets</span><Icon name="arrow-right" size={12}/><strong>{active}</strong></div><div className="role-header-actions"><button className="role-search"><Icon name="search" size={15}/><span>{role === 'tenant' || role === 'guest' ? 'Search services...' : role === 'provider' ? 'Search jobs...' : 'Search people, access, requests...'}</span></button><button className="icon-button icon-button--bordered"><Icon name="bell" size={17}/></button><span className="role-avatar">{initials}</span></div></header>
      <main><RoleSection role={role} section={section} onNavigate={go}/></main>
    </div>
  </div>
}
