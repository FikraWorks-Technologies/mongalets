import { useEffect, useState } from 'react'
import type { Role, Route } from './types'

const roles: Role[] = ['owner', 'tenant', 'provider', 'guest', 'admin']

export function parseRoute(pathname = window.location.pathname): Route {
  if (pathname === '/') return { page: 'home' }
  if (pathname === '/login') return { page: 'login' }

  const loginMatch = pathname.match(/^\/login\/(owner|tenant|provider|guest|admin)$/)
  if (loginMatch) return { page: 'login', role: loginMatch[1] as Role }

  const portalMatch = pathname.match(/^\/app\/(owner|tenant|provider|guest|admin)(?:\/([a-z0-9-]+))?$/)
  if (portalMatch && roles.includes(portalMatch[1] as Role)) {
    return { page: 'portal', role: portalMatch[1] as Role, section: portalMatch[2] }
  }

  return { page: 'not-found' }
}

export function navigate(path: string) {
  if (window.location.pathname === path) return
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function useRoute() {
  const [route, setRoute] = useState<Route>(() => parseRoute())

  useEffect(() => {
    const onChange = () => setRoute(parseRoute())
    window.addEventListener('popstate', onChange)
    return () => window.removeEventListener('popstate', onChange)
  }, [])

  return route
}
