import { CheckCircle2, XCircle, Loader2, Clock, RotateCcw, ShieldAlert } from 'lucide-react'

const STYLES = {
  completed: { classes: 'bg-success/10 text-success border-success/30', icon: CheckCircle2 },
  running: { classes: 'bg-accent/10 text-accent-bright border-accent/30', icon: Loader2, spin: true },
  pending: { classes: 'bg-gray-500/10 text-gray-400 border-gray-500/30', icon: Clock },
  failed: { classes: 'bg-danger/10 text-danger border-danger/30', icon: XCircle },
  recovering: { classes: 'bg-warning/10 text-warning border-warning/30', icon: RotateCcw, spin: true },
  waiting_approval: { classes: 'bg-warning/10 text-warning border-warning/30', icon: ShieldAlert },
  active: { classes: 'bg-success/10 text-success border-success/30', icon: CheckCircle2 },
  inactive: { classes: 'bg-gray-500/10 text-gray-400 border-gray-500/30', icon: XCircle },
  connected: { classes: 'bg-success/10 text-success border-success/30', icon: CheckCircle2 },
  error: { classes: 'bg-danger/10 text-danger border-danger/30', icon: XCircle },
}

function labelize(status) {
  if (!status) return 'Unknown'
  return status.split('_').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')
}

export default function StatusBadge({ status, label, size = 'md' }) {
  const style = STYLES[status] || STYLES.pending
  const Icon = style.icon
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5 gap-1' : 'text-sm px-2.5 py-1 gap-1.5'

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${style.classes} ${sizeClasses}`}
    >
      <Icon className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} ${style.spin ? 'animate-spin' : ''}`} />
      {label || labelize(status)}
    </span>
  )
}
