import { useEffect, useRef } from 'react'
import { Terminal, Trash2 } from 'lucide-react'
import Button from '../common/Button'
import { formatTime } from '../../utils/formatters'

const LEVEL_COLOR = {
  info: 'text-gray-300',
  success: 'text-success',
  warn: 'text-warning',
  error: 'text-danger',
}

export default function AgentLogs({ logs = [], onClear }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs.length])

  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-5 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
          <Terminal className="w-3.5 h-3.5" /> Live Agent Logs
        </span>
        <Button variant="ghost" size="sm" icon={Trash2} onClick={onClear} disabled={logs.length === 0}>
          Clear
        </Button>
      </div>
      <div
        ref={scrollRef}
        className="bg-surface-raised border border-surface-border rounded-lg p-3 h-64 overflow-y-auto font-mono text-xs space-y-1.5"
        aria-live="polite"
      >
        {logs.length === 0 ? (
          <p className="text-gray-600">Waiting for agent activity…</p>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="flex gap-2 animate-slide-in">
              <span className="text-gray-600 shrink-0">[{formatTime(log.timestamp)}]</span>
              <span className={LEVEL_COLOR[log.level] || LEVEL_COLOR.info}>{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
