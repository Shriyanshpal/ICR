import ProgressBar from '../common/ProgressBar'
import { TASK_STATUS } from '../../utils/constants'

export default function ProgressCard({ tasks = [] }) {
  const total = tasks.length
  const completed = tasks.filter((t) => t.status === TASK_STATUS.COMPLETED).length
  const pct = total > 0 ? (completed / total) * 100 : 0

  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Overall Progress</span>
        <span className="text-sm font-semibold text-gray-100">{Math.round(pct)}%</span>
      </div>
      <ProgressBar value={pct} size="lg" color={pct === 100 ? 'success' : 'accent'} />
      <p className="text-xs text-gray-500 mt-3">
        {completed} / {total || '—'} tasks completed
      </p>
    </div>
  )
}
