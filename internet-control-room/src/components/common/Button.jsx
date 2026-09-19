import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary: 'bg-accent hover:bg-accent-bright text-white shadow-sm shadow-accent/20',
  secondary: 'bg-surface-card hover:bg-surface-border text-gray-100 border border-surface-border',
  ghost: 'hover:bg-surface-card text-gray-300',
  danger: 'bg-danger/90 hover:bg-danger text-white',
  success: 'bg-success/90 hover:bg-success text-surface',
}

const SIZES = {
  sm: 'text-sm px-3 py-1.5 rounded-lg',
  md: 'text-sm px-4 py-2.5 rounded-lg',
  lg: 'text-base px-5 py-3 rounded-xl',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`focus-ring inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon ? <Icon className="w-4 h-4" /> : null}
      {children}
    </button>
  )
}
