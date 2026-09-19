import { Wrench } from 'lucide-react'
import EmptyState from '../common/EmptyState'
import { formatDuration } from '../../utils/formatters'

export default function ToolExecutionPanel({ execution }) {
  if (!execution) {
    return (
      <div className="bg-surface-card border border-surface-border rounded-xl p-5">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tool Execution</span>
        <EmptyState icon={Wrench} title="No tool calls yet" description="Tool execution details will show up here." />
      </div>
    )
  }

  const isError = execution.status === 'error'

  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-5 animate-fade-in">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tool Execution</span>
      <div className="mt-3 space-y-3 text-sm">
        <Row label="Tool" value={execution.tool} />
        <Row
          label="API Status"
          value={
            <span className={`inline-flex items-center gap-1.5 ${isError ? 'text-danger' : 'text-success'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isError ? 'bg-danger' : 'bg-success'}`} />
              {isError ? 'Error' : 'Connected'}
            </span>
          }
        />
        <Row label="Request Status" value={<span className="font-mono">{execution.requestStatus}</span>} />
        <Row label="Execution Time" value={<span className="font-mono">{formatDuration(execution.executionTimeMs)}</span>} />
        <Row
          label="Result"
          value={<span className={isError ? 'text-danger' : 'text-success'}>{execution.result}</span>}
        />
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-surface-border/60 pb-2 last:border-0 last:pb-0">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-200 font-medium">{value}</span>
    </div>
  )
}
