import { useEffect, useState } from 'react'

/**
 * Browser-local demo records only.
 * This is NOT an authentication, access-control or notification service.
 * Real access approval/OTP and presence tracking must be enforced by a backend.
 */
export type VisitStatus = 'Pending' | 'Approved' | 'Rejected' | 'Checked in' | 'Checked out'
export interface Visit {
  id: string
  name: string
  phone: string
  date: string
  time: string
  minors: number
  purpose: string
  status: VisitStatus
  source: 'Resident' | 'Visitor'
  createdAt: string
  code: string
}
const STORAGE_KEY = 'mongalets_demo_visits_v3'
const CHANGE_EVENT = 'mongalets:visits-updated'
const today = (offset = 0) => { const d = new Date(); d.setDate(d.getDate() + offset); return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-') }
const seed = (): Visit[] => [
  { id: 'sample-grace', name: 'Grace Wanjiku', phone: '07•• ••• 123', date: today(), time: '14:30', minors: 1, purpose: 'Visiting resident', status: 'Approved', source: 'Resident', createdAt: new Date().toISOString(), code: 'ML-GRACE-4931' },
  { id: 'sample-peter', name: 'Peter Otieno', phone: '07•• ••• 456', date: today(1), time: '10:00', minors: 0, purpose: 'Visiting resident', status: 'Pending', source: 'Visitor', createdAt: new Date().toISOString(), code: 'ML-PETER-2048' },
]
export function readVisits(): Visit[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw === null) return seed()
    const value: unknown = JSON.parse(raw)
    return Array.isArray(value) ? value.filter((v): v is Visit => Boolean(v && typeof v.id === 'string' && typeof v.status === 'string')) : seed()
  } catch { return seed() }
}
function save(visits: Visit[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(visits))
  window.dispatchEvent(new Event(CHANGE_EVENT))
}
export function useVisits() {
  const [visits, setVisits] = useState<Visit[]>(readVisits)
  useEffect(() => {
    const update = () => setVisits(readVisits())
    window.addEventListener(CHANGE_EVENT, update)
    window.addEventListener('storage', update)
    return () => { window.removeEventListener(CHANGE_EVENT, update); window.removeEventListener('storage', update) }
  }, [])
  return visits
}
export function addVisit(data: Pick<Visit, 'name' | 'phone' | 'date' | 'time' | 'minors' | 'purpose'>, source: Visit['source']) {
  const id = Math.random().toString(36).slice(2, 10)
  const visit: Visit = {
    ...data,
    id,
    status: source === 'Resident' ? 'Approved' : 'Pending',
    source,
    createdAt: new Date().toISOString(),
    code: `ML-V-${id.toUpperCase()}`,
  }
  save([visit, ...readVisits()])
  return visit
}
export function updateVisit(id: string, status: VisitStatus) {
  const visits = readVisits()
  const current = visits.find(v => v.id === id)
  if (!current) return false
  const valid: Record<VisitStatus, VisitStatus[]> = {
    Pending: ['Approved', 'Rejected'],
    Approved: ['Checked in', 'Rejected'],
    Rejected: [],
    'Checked in': ['Checked out'],
    'Checked out': [],
  }
  if (!valid[current.status].includes(status)) return false
  save(visits.map(v => v.id === id ? { ...v, status } : v))
  return true
}
export function findCredential(code: string) {
  const normalized = code.trim().toUpperCase()
  if (normalized === 'ML-A5G-7284') return { name: 'Demo resident · A5G', status: 'Resident credential', code: normalized }
  if (normalized === 'ML-PROV-5820') return { name: 'Demo service provider · A5G', status: 'Provider demo credential', code: normalized }
  const visit = readVisits().find(v => v.code === normalized)
  if (!visit || !['Approved', 'Checked in'].includes(visit.status)) return null
  return { name: visit.name, status: visit.status, code: visit.code, visit }
}
