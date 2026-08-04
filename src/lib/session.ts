import { useEffect, useState } from 'react'
import type { Role, Session } from './types'

const STORAGE_KEY = 'mongalets_session'
const CHANNEL_KEY = 'mongalets_session_channel'

function safelyParse(value: string | null): Session | null {
  if (!value) return null
  try {
    return JSON.parse(value) as Session
  } catch {
    return null
  }
}

export function getSession() {
  return safelyParse(window.localStorage.getItem(STORAGE_KEY))
}

export function createDemoSession(role: Role, email: string): Session {
  const names: Record<Role, string> = {
    owner: 'Denzel Opondo',
    tenant: 'Amina Njeri',
    provider: 'DenzeK Services',
    guest: 'Sarah Ahura',
    admin: 'MongaLets Admin',
  }

  const session: Session = {
    role,
    name: names[role],
    email,
    signedInAt: new Date().toISOString(),
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  window.dispatchEvent(new CustomEvent('mongalets:session', { detail: session }))

  if ('BroadcastChannel' in window) {
    const channel = new BroadcastChannel(CHANNEL_KEY)
    channel.postMessage({ type: 'session', session })
    channel.close()
  }

  return session
}

export function clearSession() {
  window.localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new CustomEvent('mongalets:session', { detail: null }))

  if ('BroadcastChannel' in window) {
    const channel = new BroadcastChannel(CHANNEL_KEY)
    channel.postMessage({ type: 'session', session: null })
    channel.close()
  }
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(() => getSession())
  const [syncedFromAnotherTab, setSyncedFromAnotherTab] = useState(false)

  useEffect(() => {
    const update = () => setSession(getSession())
    const onCustom = (event: Event) => {
      const detail = (event as CustomEvent<Session | null>).detail
      setSession(detail)
    }

    window.addEventListener('storage', update)
    window.addEventListener('mongalets:session', onCustom)

    let channel: BroadcastChannel | null = null
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel(CHANNEL_KEY)
      channel.onmessage = (event) => {
        if (event.data?.type !== 'session') return
        setSession(event.data.session as Session | null)
        setSyncedFromAnotherTab(true)
        window.setTimeout(() => setSyncedFromAnotherTab(false), 3500)
      }
    }

    return () => {
      window.removeEventListener('storage', update)
      window.removeEventListener('mongalets:session', onCustom)
      channel?.close()
    }
  }, [])

  return { session, syncedFromAnotherTab }
}
