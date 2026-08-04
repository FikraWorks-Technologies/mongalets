import { useEffect, useState } from 'react'
import { Icon } from './Icon'
import { Logo } from './Logo'
import { navigate } from '../lib/router'
import type { Session } from '../lib/types'

export function PublicNav({ session }: { session: Session | null }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (hash: string) => {
    setOpen(false)
    const target = document.querySelector(hash)
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header className={`public-nav ${scrolled ? 'public-nav--scrolled' : ''}`}>
      <div className="container public-nav__inner">
        <button className="logo-button" onClick={() => navigate('/')} aria-label="Go to MongaLets home">
          <Logo />
        </button>

        <nav className={`public-nav__links ${open ? 'is-open' : ''}`} aria-label="Main navigation">
          <button onClick={() => go('#platform')}>Platform</button>
          <button onClick={() => go('#roles')}>Who it serves</button>
          <button onClick={() => go('#providers')}>Service providers</button>
          <button onClick={() => go('#experience')}>How it works</button>
          <button onClick={() => go('#contact')}>Contact</button>
        </nav>

        <div className="public-nav__actions">
          <button className="button button--ghost button--small public-nav__desktop-action" onClick={() => navigate(session ? `/app/${session.role}` : '/login')}>
            {session ? 'Open dashboard' : 'Sign in'}
          </button>
          <button className="button button--primary button--small public-nav__desktop-action" onClick={() => navigate('/login/owner')}>
            List or manage property
            <Icon name="arrow-right" size={16} />
          </button>
          <button className="icon-button public-nav__menu" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation" aria-expanded={open}>
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
    </header>
  )
}
