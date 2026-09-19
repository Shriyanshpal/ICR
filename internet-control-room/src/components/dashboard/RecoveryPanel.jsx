import { AlertTriangle, RotateCcw } from 'lucide-react'
import ProgressBar from '../common/ProgressBar'

export default function RecoveryPanel({ task }) {
  if (!task) return null

  const { tool, error, retryCount = 0, maxRetries = 3, recoveryStrategy, fallbackTool, status } = task
  const isRetrying = status === 'recovering'

  return (
    <div className="bg-warning/5 border border-warning/25 rounded-xl p-5 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-4.5 h-4.5 text-warning" />
        <span className="text-xs font-semibold text-warning uppercase tracking-wide">Task Failed</span>
      </div>

      <h3 className="text-gray-100 font-semibold mb-1">{tool}</h3>
      <p className="text-sm text-gray-400 mb-4">{error}</p>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Retry</span>
          <span className="text-gray-200 font-mono">{retryCount} / {maxRetries}</span>
        </div>
        <ProgressBar value={(retryCount / maxRetries) * 100} color="warning" size="sm" />
        <div className="flex items-center justify-between pt-1">
          <span className="text-gray-500">Recovery Strategy</span>
          <span className="text-gray-200 text-right">{recoveryStrategy}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Fallback Tool</span>
          <span className="text-gray-200">{fallbackTool}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Status</span>
          <span className="text-warning font-medium inline-flex items-center gap-1.5">
            {isRetrying && <RotateCcw className="w-3.5 h-3.5 animate-spin" />}
            {isRetrying ? 'Retrying…' : 'Pending retry'}
          </span>
        </div>
      </div>
    </div>
  )
}
