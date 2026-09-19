// Small formatting helpers shared across components

export function formatTime(date) {
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleTimeString('en-GB', { hour12: false })
}

export function formatDuration(ms) {
  if (ms == null) return '—'
  if (ms < 1000) return `${Math.round(ms)}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

export function formatPercent(value) {
  return `${Math.round(value)}%`
}

export function statusToLabel(status) {
  if (!status) return 'Unknown'
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function truncate(text, max = 80) {
  if (!text) return ''
  return text.length > max ? `${text.slice(0, max)}…` : text
}
