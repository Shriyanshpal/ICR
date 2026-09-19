import { Target } from 'lucide-react'
import TaskCard from './TaskCard'
import EmptyState from '../common/EmptyState'

export default function TaskWorkflow({ goal, tasks = [] }) {
  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-5">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Task Workflow</span>

      {tasks.length === 0 ? (
        <EmptyState icon={Target} title="Plan not generated yet" description="The workflow will appear once the agent finishes planning." />
      ) : (
        <div className="flex flex-col items-center mt-4">
          <div className="w-full max-w-lg rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-center mb-1">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Goal</p>
            <p className="text-sm text-gray-100 font-medium">{goal}</p>
          </div>
          <div className="w-px h-6 bg-surface-border" aria-hidden="true" />
          <div className="w-full max-w-lg space-y-0">
            {tasks.map((task, i) => (
              <TaskCard key={task.id} task={task} isLast={i === tasks.length - 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
