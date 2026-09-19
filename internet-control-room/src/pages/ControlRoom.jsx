import { useParams, useNavigate } from 'react-router-dom'
import { Radio } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import AgentStatus from '../components/dashboard/AgentStatus'
import ProgressCard from '../components/dashboard/ProgressCard'
import CurrentTask from '../components/dashboard/CurrentTask'
import TaskWorkflow from '../components/dashboard/TaskWorkflow'
import ToolExecutionPanel from '../components/dashboard/ToolExecutionPanel'
import AgentLogs from '../components/dashboard/AgentLogs'
import RecoveryPanel from '../components/dashboard/RecoveryPanel'
import ApprovalModal from '../components/dashboard/ApprovalModal'
import FinalResult from '../components/dashboard/FinalResult'
import LoadingState from '../components/common/LoadingState'
import { useAgentRun } from '../hooks/useAgentRun'
import { AGENT_STATUS, TASK_STATUS } from '../utils/constants'

export default function ControlRoom() {
  const { runId } = useParams()
  const navigate = useNavigate()
  const run = useAgentRun(runId)

  if (!runId) {
    return (
      <PageContainer>
        <EmptyState
          icon={Radio}
          title="No active run"
          description="Start an agent from the Home page to see it here."
          action={<Button onClick={() => navigate('/')}>Go to Home</Button>}
        />
      </PageContainer>
    )
  }

  if (run.loading) {
    return (
      <PageContainer>
        <LoadingState label="Loading run…" />
      </PageContainer>
    )
  }

  if (run.error && run.tasks.length === 0) {
    return (
      <PageContainer>
        <div className="max-w-lg mx-auto text-center py-16">
          <h2 className="text-lg font-semibold text-gray-100 mb-2">Couldn't load this run</h2>
          <p className="text-sm text-gray-500">{run.error}</p>
        </div>
      </PageContainer>
    )
  }

  const failedTask = run.tasks.find((t) => t.status === TASK_STATUS.FAILED)
  const showRecovery = run.status === AGENT_STATUS.RECOVERING && failedTask
  const isCompleted = run.status === AGENT_STATUS.COMPLETED

  return (
    <PageContainer>
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
          <h1 className="text-xl font-bold text-gray-50 tracking-tight">Control Room</h1>
          <span className="text-xs font-mono text-gray-500">Run ID: {run.runId}</span>
        </div>
        <p className="text-sm text-gray-500">Live view of the agent's execution pipeline</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <AgentStatus status={run.status} />
        <ProgressCard tasks={run.tasks} />
        <CurrentTask task={run.currentTask} />
      </div>

      {isCompleted ? (
        <div className="mb-4">
          <FinalResult
            goal={run.goal}
            finalResult={run.finalResult}
            stats={run.stats}
            startedAt={run.startedAt}
            completedAt={run.completedAt}
          />
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <TaskWorkflow goal={run.goal} tasks={run.tasks} />
          <AgentLogs logs={run.logs} onClear={run.clearLogs} />
        </div>
        <div className="space-y-4">
          <ToolExecutionPanel execution={run.lastToolExecution} />
          {showRecovery && <RecoveryPanel task={failedTask} />}
        </div>
      </div>

      <ApprovalModal
        approval={run.approval}
        onApprove={() => run.respondToApproval(true)}
        onReject={() => run.respondToApproval(false)}
      />
    </PageContainer>
  )
}
