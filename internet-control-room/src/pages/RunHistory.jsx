import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { History, Eye } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import StatusBadge from '../components/common/StatusBadge'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import { Skeleton } from '../components/common/LoadingState'
import { listRunHistory as apiListRunHistory } from '../services/api'
import { mockListRunHistory } from '../services/mockService'
import { USE_MOCK } from '../utils/constants'
import { formatDuration } from '../utils/formatters'

export default function RunHistory() {
  const [runs, setRuns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      try {
        const fetcher = USE_MOCK ? mockListRunHistory : apiListRunHistory
        const data = await fetcher()
        setRuns(data.slice().reverse())
      } catch (err) {
        setError(err.message || 'Failed to load run history')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <PageContainer>
      <h1 className="text-xl font-bold text-gray-50 tracking-tight">Run History</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">Previous and current agent runs</p>

      {error && <p className="text-sm text-danger mb-4">{error}</p>}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : runs.length === 0 ? (
        <EmptyState
          icon={History}
          title="No runs yet"
          description="Start an agent from the Home page to see its run here."
          action={<Button onClick={() => navigate('/')}>Go to Home</Button>}
        />
      ) : (
        <div className="space-y-3">
          {runs.map((run) => {
            const duration =
              run.startedAt && run.completedAt
                ? new Date(run.completedAt).getTime() - new Date(run.startedAt).getTime()
                : null
            return (
              <div
                key={run.runId}
                className="bg-surface-card border border-surface-border rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap hover:border-accent/30 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-mono text-gray-500">{run.runId}</span>
                    <StatusBadge status={run.status} size="sm" />
                  </div>
                  <p className="text-sm text-gray-200 truncate">{run.goal}</p>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-500">
                    <span>{run.tasks?.length || 0} tasks</span>
                    <span className="font-mono">{formatDuration(duration)}</span>
                    <span>{new Date(run.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Eye}
                  onClick={() => navigate(`/control-room/${run.runId}`)}
                >
                  View
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </PageContainer>
  )
}
