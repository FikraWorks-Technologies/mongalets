import { Icon } from './Icon'

export function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div className={`toast ${visible ? 'toast--visible' : ''}`} role="status" aria-live="polite">
      <span className="toast__icon"><Icon name="sync" size={17} /></span>
      <span>{message}</span>
    </div>
  )
}
