import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Copy, RotateCw, Check } from 'lucide-react'
import Button from '../common/Button'
import { formatDuration } from '../../utils/formatters'

export default function FinalResult({ goal, finalResult, stats, startedAt, completedAt }) {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const durationMs =
    startedAt && completedAt ? new Date(completedAt).getTime() - new Date(startedAt).getTime() : null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(finalResult || '')
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard may be unavailable — fail silently, UI just won't confirm
    }
  }

  return (
    <div className="bg-success/5 border border-success/25 rounded-xl p-6 animate-fade-in">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-success" />
        </div>
        <h2 className="font-semibold text-gray-100">Execution Complete</h2>
      </div>

      <div className="mb-5">
        <p className="text-xs text-gray-500 mb-1">Goal</p>
        <p className="text-gray-200">{goal}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <Stat label="Tasks Executed" value={stats.tasksExecuted} />
        <Stat label="Tools Used" value={stats.toolsUsed} />
        <Stat label="Recovered" value={stats.recoveredTasks} />
        <Stat label="Failed" value={stats.failedTasks} />
      </div>

      <div className="mb-5">
        <p className="text-xs text-gray-500 mb-1">Execution Duration</p>
        <p className="text-gray-200 font-mono">{formatDuration(durationMs)}</p>
      </div>

      <div className="mb-6">
        <p className="text-xs text-gray-500 mb-2">Final Output</p>
        <div className="bg-surface-raised border border-surface-border rounded-lg p-4 text-sm text-gray-200 leading-relaxed">
          {finalResult}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" icon={copied ? Check : Copy} onClick={handleCopy}>
          {copied ? 'Copied' : 'Copy Result'}
        </Button>
        <Button variant="primary" icon={RotateCw} onClick={() => navigate('/')}>
          Run Again
        </Button>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="bg-surface-raised border border-surface-border rounded-lg p-3 text-center">
      <p className="text-lg font-semibold text-gray-100">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}
