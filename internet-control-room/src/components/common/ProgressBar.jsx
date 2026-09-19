export default function ProgressBar({ value = 0, size = 'md', color = 'accent' }) {
  const clamped = Math.min(100, Math.max(0, value))
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' }
  const colors = {
    accent: 'bg-accent',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
  }

  return (
    <div
      className={`w-full ${heights[size]} rounded-full bg-surface-border/60 overflow-hidden`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`${heights[size]} ${colors[color]} rounded-full transition-all duration-700 ease-out`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
