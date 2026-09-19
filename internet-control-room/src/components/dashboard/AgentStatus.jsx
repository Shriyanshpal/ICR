import { Brain, PlayCircle, ShieldCheck, RotateCcw, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react'
import { AGENT_STATUS } from '../../utils/constants'

const CONFIG = {
  [AGENT_STATUS.PLANNING]: { label: 'Planning', icon: Brain, color: 'text-accent-bright', dot: 'bg-accent', pulse: true },
  [AGENT_STATUS.RUNNING]: { label: 'Running', icon: PlayCircle, color: 'text-accent-bright', dot: 'bg-accent', pulse: true },
  [AGENT_STATUS.VERIFYING]: { label: 'Verifying', icon: ShieldCheck, color: 'text-accent-bright', dot: 'bg-accent', pulse: true },
  [AGENT_STATUS.RECOVERING]: { label: 'Recovering', icon: RotateCcw, color: 'text-warning', dot: 'bg-warning', pulse: true },
  [AGENT_STATUS.WAITING_APPROVAL]: { label: 'Waiting for Approval', icon: ShieldAlert, color: 'text-warning', dot: 'bg-warning', pulse: true },
  [AGENT_STATUS.COMPLETED]: { label: 'Completed', icon: CheckCircle2, color: 'text-success', dot: 'bg-success', pulse: false },
  [AGENT_STATUS.FAILED]: { label: 'Failed', icon: XCircle, color: 'text-danger', dot: 'bg-danger', pulse: false },
}

export default function AgentStatus({ status }) {
  const cfg = CONFIG[status] || CONFIG[AGENT_STATUS.PLANNING]
  const Icon = cfg.icon

  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Agent Status</span>
        <span className={`relative flex w-2.5 h-2.5`}>
          {cfg.pulse && (
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cfg.dot} opacity-60`} />
          )}
          <span className={`relative inline-flex rounded-full w-2.5 h-2.5 ${cfg.dot}`} />
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg bg-surface-raised flex items-center justify-center ${cfg.color}`}>
          <Icon className={`w-5 h-5 ${cfg.pulse ? 'animate-pulse-slow' : ''}`} />
        </div>
        <div>
          <p className={`font-semibold ${cfg.color}`}>{cfg.label}</p>
          <p className="text-xs text-gray-500">Live agent state</p>
        </div>
      </div>
    </div>
  )
}
