import { useMemo, useState } from 'react'
import { Icon } from '../components/Icon'
import { Modal } from '../components/Modal'
import { useVisits } from '../lib/demoVisits'
import type { Role } from '../lib/types'

const dateKey=(d:Date)=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')
const shift=(date:Date,offset:number)=>{const copy=new Date(date);copy.setDate(copy.getDate()+offset);return copy}
const firstDay=(date:Date)=>new Date(date.getFullYear(),date.getMonth(),1)
const label=(date:Date)=>date.toLocaleDateString('en-KE',{month:'long',year:'numeric'})
type Appointment={id:string;title:string;date:string;description:string}
export function RoleCalendar({role}:{role:Role}){
 const today=new Date(),visits=useVisits()
 const [month,setMonth]=useState(()=>firstDay(today))
 const [picked,setPicked]=useState<Date|null>(null)
 const currentMonth=month.getMonth(),currentYear=month.getFullYear()
 const appointments=useMemo<Appointment[]>(()=>{
  if(role==='tenant'||role==='owner'||role==='admin')return visits.map(v=>({id:v.id,title:`Visit · ${v.name}`,date:v.date,description:`${v.time} · A5G · ${v.status}`}))
  if(role==='guest')return visits.filter(v=>v.id==='sample-grace').map(v=>({id:v.id,title:'Riverside apartment visit',date:v.date,description:`${v.time} · ${v.status}`}))
  return [{id:'job-1',title:'Plumbing · A5G',date:dateKey(today),description:'16:00 · Riverside Apartments · Demo job'},{id:'job-2',title:'Electrical inspection · B2',date:dateKey(shift(today,1)),description:'11:00 · Westlands Heights · Demo job'}]
 },[role,visits])
 const start=new Date(currentYear,currentMonth,1).getDay(),days=new Date(currentYear,currentMonth+1,0).getDate()
 const cells=Array.from({length:Math.ceil((start+days)/7)*7},(_,i)=>i-start+1)
 const selected=picked?appointments.filter(x=>x.date===dateKey(picked)):[]
 const inMonth=appointments.filter(x=>{const d=new Date(x.date+'T12:00:00');return d.getMonth()===currentMonth&&d.getFullYear()===currentYear})
 const move=(delta:number)=>{setMonth(new Date(currentYear,currentMonth+delta,1));setPicked(null)}
 return <div className="role-section-page"><div className="role-section-head"><div><span className="eyebrow">{role} workspace</span><h1>{role==='provider'?'Schedule':'Calendar'}</h1><p>Explore appointments and browser-local visitor requests by date.</p></div></div>
 <section className="role-panel calendar-panel"><div className="calendar-toolbar"><button aria-label="Previous month" className="button button--secondary" onClick={()=>move(-1)}>‹</button><h2 aria-live="polite">{label(month)}</h2><button aria-label="Next month" className="button button--secondary" onClick={()=>move(1)}>›</button><button className="button button--primary" onClick={()=>{setMonth(firstDay(new Date()));setPicked(new Date())}}>Today</button></div>
 <div className="calendar-grid calendar-head">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(x=><strong key={x}>{x}</strong>)}</div>
 <div className="calendar-grid">{cells.map((day,i)=>{if(day<1||day>days)return <div key={i} className="calendar-day muted" aria-hidden="true"/>;const d=new Date(currentYear,currentMonth,day),events=appointments.filter(x=>x.date===dateKey(d));return <button key={i} className={`calendar-day ${dateKey(d)===dateKey(today)?'today':''}`} onClick={()=>setPicked(d)} aria-label={`${d.toLocaleDateString('en-KE')} · ${events.length} event(s)`}><span>{day}</span>{events.slice(0,2).map(x=><small key={x.id}>{x.title}</small>)}{events.length>2&&<small>+{events.length-2} more</small>}</button>})}</div></section>
 <section className="role-panel"><div className="role-panel-head"><h2>Appointments in {label(month)}</h2><span className="eyebrow">{inMonth.length} scheduled / requested</span></div><div className="role-list">{inMonth.length?inMonth.map(x=><button className="role-list-row" key={x.id} onClick={()=>setPicked(new Date(x.date+'T12:00:00'))}><span className="role-list-icon role-tone-info"><Icon name="calendar" size={17}/></span><div><strong>{x.title}</strong><small>{x.date} · {x.description}</small></div><Icon name="arrow-right" size={16}/></button>):<p className="demo-disclaimer">No appointments recorded for this month in this demo.</p>}</div></section>
 <Modal open={Boolean(picked)} title={picked?picked.toLocaleDateString('en-KE',{weekday:'long',day:'numeric',month:'long',year:'numeric'}):'Date'} eyebrow="Daily appointments" onClose={()=>setPicked(null)}>{selected.length?selected.map(x=><div className="role-panel" key={x.id}><h3>{x.title}</h3><p>{x.description}</p></div>):<p>No appointments scheduled for this day.</p>}</Modal></div>
}
