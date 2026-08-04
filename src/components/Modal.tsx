import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Icon } from './Icon'

export function Modal({
  open,
  onClose,
  title,
  eyebrow,
  children,
  size = 'medium',
}: {
  open: boolean
  onClose: () => void
  title: string
  eyebrow?: string
  children: ReactNode
  size?: 'small' | 'medium' | 'large'
}) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      previous?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`modal modal--${size}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header className="modal__header">
          <div>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h2 id="modal-title">{title}</h2>
          </div>
          <button ref={closeRef} className="icon-button" onClick={onClose} aria-label="Close dialog">
            <Icon name="close" />
          </button>
        </header>
        <div className="modal__body">{children}</div>
      </section>
    </div>
  )
}
