import { Icon } from './Icon'

export function Logo({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  return (
    <div className={`brand ${inverse ? 'brand--inverse' : ''}`} aria-label="MongaLets home">
      <span className="brand__mark"><Icon name="building" size={21} /></span>
      {!compact && (
        <span className="brand__text">
          <strong>MongaLets</strong>
          <small>Property & Facility Ecosystem</small>
        </span>
      )}
    </div>
  )
}
