import { useEffect, useState } from 'react'
import type { Role, Session } from '../lib/types'
import { navigate } from '../lib/router'
import './portal-enhancements.css'
const access:Record<Role,string>={owner:'Verify access',admin:'Verify access',tenant:'My access',provider:'Access pass',guest:'Access pass'}
const slug=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-')
const KEY='mongalets.role-profiles.v1'
function stored(role:Role){try{return JSON.parse(localStorage.getItem(KEY)||'{}')[role]}catch{return undefined}}
export function PortalEnhancements({role,session}:{role:Role;session:Session}){
 const [open,setOpen]=useState(false),[photo,setPhoto]=useState<string|undefined>(()=>stored(role)?.photo)
 useEffect(()=>{const nav=document.querySelector('.security-nav'),first=nav?.querySelector('button'),label=access[role];if(nav&&first&&!nav.querySelector('[data-mongalets-access]')){const b=document.createElement('button');b.dataset.mongaletsAccess='true';b.className='mongalets-access-nav';b.innerHTML=`<span class="portal-access-icon">⌁</span><span>${label}</span><b>ACCESS</b>`;b.onclick=()=>navigate(`/app/${role}/${slug(label)}`);first.insertAdjacentElement('afterend',b)};const avatar=document.querySelector('.portal-avatar') as HTMLButtonElement|null;if(avatar){avatar.onclick=()=>setOpen(v=>!v);avatar.setAttribute('aria-label','Open profile menu');if(photo){avatar.innerHTML=`<img src="${photo}" alt="Profile"/>`;avatar.classList.add('has-photo')}};const update=(e:Event)=>{const d=(e as CustomEvent<{photo?:string}>).detail;setPhoto(d?.photo);if(avatar&&d?.photo){avatar.innerHTML=`<img src="${d.photo}" alt="Profile"/>`;avatar.classList.add('has-photo')}};window.addEventListener('mongalets:profile',update);return()=>window.removeEventListener('mongalets:profile',update)},[role,photo])
 if(!open)return null
 const initials=session.name.split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase()
 return <><button className="profile-menu-backdrop" aria-label="Close profile menu" onClick={()=>setOpen(false)}/><div className="profile-dropdown"><div className="profile-dropdown-head">{photo?<img src={photo} alt={session.name}/>:<span>{initials}</span>}<div><strong>{session.name}</strong><small>{session.email}</small></div></div><div className="profile-dropdown-role">{role==='owner'?'Management':role==='admin'?'Security administrator':role==='tenant'?'Resident / tenant':role==='provider'?'Service provider':'Guest'}</div><button onClick={()=>{setOpen(false);navigate(`/app/${role}/profile`)}}>My profile <span>→</span></button><button onClick={()=>setOpen(false)}>Account settings <span>→</span></button></div></>
}
