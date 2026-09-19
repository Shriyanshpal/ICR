import { Loader2 } from 'lucide-react'

export function Spinner({ className = '' }) {
  return <Loader2 className={`animate-spin ${className}`} />
}

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-surface-border/50 rounded-md ${className}`} />
}

export default function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-gray-400 text-sm">
      <Spinner className="w-4 h-4" />
      {label}
    </div>
  )
}
