import { useEffect, useId, useRef } from 'react'
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
 const dialogRef = useRef<HTMLElement>(null)
 const titleId = useId()

 useEffect(() => {
  if (!open) return
  const previousFocus = document.activeElement as HTMLElement | null
  const previousOverflow = document.body.style.overflow
  const handleKey = (event: KeyboardEvent) => {
   if (event.key === 'Escape') { event.stopPropagation(); onClose(); return }
   if (event.key !== 'Tab' || !dialogRef.current) return
   const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')).filter(element=>element.getClientRects().length>0)
   if (!focusable.length) { event.preventDefault(); return }
   const first=focusable[0],last=focusable[focusable.length-1]
   if (event.shiftKey&&(document.activeElement===first||!dialogRef.current.contains(document.activeElement))) {event.preventDefault();last.focus()}
   else if (!event.shiftKey&&(document.activeElement===last||!dialogRef.current.contains(document.activeElement))) {event.preventDefault();first.focus()}
  }
  document.body.style.overflow='hidden'
  window.addEventListener('keydown',handleKey)
  closeRef.current?.focus()
  return ()=>{
   document.body.style.overflow=previousOverflow
   window.removeEventListener('keydown',handleKey)
   previousFocus?.focus()
  }
 },[open,onClose])
 if(!open)return null
 return <div className="modal-backdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)onClose()}}>
  <section className={`modal modal--${size}`} ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId}>
   <header className="modal__header"><div>{eyebrow&&<span className="eyebrow">{eyebrow}</span>}<h2 id={titleId}>{title}</h2></div><button ref={closeRef} className="icon-button" onClick={onClose} aria-label="Close dialog"><Icon name="close"/></button></header>
   <div className="modal__body">{children}</div>
  </section>
 </div>
}
