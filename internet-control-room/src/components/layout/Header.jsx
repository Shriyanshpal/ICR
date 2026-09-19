import { Menu } from 'lucide-react'

export default function Header({ onMenuClick, connected, title }) {
  return (
    <header className="h-16 border-b border-surface-border bg-surface/80 backdrop-blur flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-400 hover:text-gray-100 focus-ring rounded p-1"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-medium text-gray-300">{title}</h1>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span
          className={`w-2 h-2 rounded-full ${connected ? 'bg-success animate-pulse-slow' : 'bg-danger'}`}
          aria-hidden="true"
        />
        <span className="hidden sm:inline">{connected ? 'Connected' : 'Demo mode'}</span>
      </div>
    </header>
  )
}
