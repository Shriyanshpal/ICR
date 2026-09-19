import { CheckCircle2, Circle, Loader2, XCircle, RotateCcw, ShieldAlert } from 'lucide-react'
import { TASK_STATUS } from '../../utils/constants'
import { formatDuration } from '../../utils/formatters'

const ICONS = {
  [TASK_STATUS.COMPLETED]: { icon: CheckCircle2, color: 'text-success' },
  [TASK_STATUS.RUNNING]: { icon: Loader2, color: 'text-accent-bright', spin: true },
  [TASK_STATUS.PENDING]: { icon: Circle, color: 'text-gray-600' },
  [TASK_STATUS.FAILED]: { icon: XCircle, color: 'text-danger' },
  [TASK_STATUS.RECOVERING]: { icon: RotateCcw, color: 'text-warning', spin: true },
  [TASK_STATUS.WAITING_APPROVAL]: { icon: ShieldAlert, color: 'text-warning' },
}

export default function TaskCard({ task, isLast }) {
  const cfg = ICONS[task.status] || ICONS[TASK_STATUS.PENDING]
  const Icon = cfg.icon
  const isCompleted = task.status === TASK_STATUS.COMPLETED
  const isFailed = task.status === TASK_STATUS.FAILED

  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-full rounded-lg border p-4 transition-all duration-300 ${
          isCompleted
            ? 'bg-success/5 border-success/25'
            : isFailed
            ? 'bg-danger/5 border-danger/25'
            : task.status === TASK_STATUS.RUNNING
            ? 'bg-accent/5 border-accent/30 shadow-sm shadow-accent/10'
            : 'bg-surface-raised border-surface-border'
        }`}
      >
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${cfg.color} ${cfg.spin ? 'animate-spin' : ''}`} />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-100 text-sm">{task.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
              {task.tool && <span>Tool: <span className="text-gray-300">{task.tool}</span></span>}
              {task.executionTimeMs != null && (
                <span>Time: <span className="text-gray-300 font-mono">{formatDuration(task.executionTimeMs)}</span></span>
              )}
            </div>
            {task.result && (
              <p className="text-xs text-success mt-2 bg-success/5 border border-success/15 rounded px-2 py-1">
                {task.result}
              </p>
            )}
            {task.error && (
              <p className="text-xs text-danger mt-2 bg-danger/5 border border-danger/15 rounded px-2 py-1">
                {task.error}
              </p>
            )}
          </div>
        </div>
      </div>
      {!isLast && <div className="w-px h-6 bg-surface-border" aria-hidden="true" />}
    </div>
  )
}
