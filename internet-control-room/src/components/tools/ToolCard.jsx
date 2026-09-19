import { Wrench, KeyRound } from 'lucide-react'
import StatusBadge from '../common/StatusBadge'

export default function ToolCard({ tool }) {
  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-5 hover:border-accent/30 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
          <Wrench className="w-5 h-5 text-accent-bright" />
        </div>
        <StatusBadge status={tool.status} size="sm" />
      </div>

      <h3 className="font-semibold text-gray-100 mb-1">{tool.name}</h3>
      <p className="text-sm text-gray-500 mb-4">{tool.description}</p>

      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
        <KeyRound className="w-3.5 h-3.5" />
        Authentication: <span className="text-gray-300">{tool.authType}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(tool.actions || []).map((action) => (
          <span
            key={action}
            className="text-xs font-mono bg-surface-raised border border-surface-border rounded px-2 py-1 text-gray-400"
          >
            {action}
          </span>
        ))}
      </div>
    </div>
  )
}
