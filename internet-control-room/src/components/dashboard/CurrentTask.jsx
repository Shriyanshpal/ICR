import { Zap } from 'lucide-react'
import StatusBadge from '../common/StatusBadge'
import EmptyState from '../common/EmptyState'
import { formatTime, formatDuration } from '../../utils/formatters'

export default function CurrentTask({ task }) {
  if (!task) {
    return (
      <div className="bg-surface-card border border-surface-border rounded-xl p-5 lg:col-span-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Current Task</span>
        <EmptyState
          icon={Zap}
          title="No active task"
          description="Waiting for the agent to start the next step."
        />
      </div>
    )
  }

  const elapsedMs = task.startedAt ? Date.now() - new Date(task.startedAt).getTime() : null

  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-5 lg:col-span-2 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Current Task</span>
        <StatusBadge status={task.status} />
      </div>
      <h3 className="text-lg font-semibold text-gray-100 mb-4">{task.name}</h3>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-xs text-gray-500 mb-1">Tool</p>
          <p className="text-gray-200 font-medium">{task.tool || '—'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Started</p>
          <p className="text-gray-200 font-medium font-mono">
            {task.startedAt ? formatTime(task.startedAt) : '—'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Execution Time</p>
          <p className="text-gray-200 font-medium font-mono">
            {formatDuration(task.executionTimeMs ?? elapsedMs)}
          </p>
        </div>
      </div>
    </div>
  )
}
