import { NavLink } from 'react-router-dom'
import { Satellite, Home, Radio, Wrench, History, X } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/control-room', label: 'Control Room', icon: Radio },
  { to: '/tools', label: 'Tool Registry', icon: Wrench },
  { to: '/history', label: 'Run History', icon: History },
]

export default function Sidebar({ open, onClose, connected }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-surface-raised border-r border-surface-border flex flex-col transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
              <Satellite className="w-4.5 h-4.5 text-accent-bright" />
            </div>
            <span className="font-semibold text-gray-100 tracking-tight">Internet Control Room</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-gray-200 focus-ring rounded"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Main navigation">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `focus-ring flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent/10 text-accent-bright border border-accent/20'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-surface-card border border-transparent'
                }`
              }
            >
              <Icon className="w-4.5 h-4.5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-surface-border">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span
              className={`w-2 h-2 rounded-full ${connected ? 'bg-success animate-pulse-slow' : 'bg-danger'}`}
            />
            {connected ? 'Backend connected' : 'Backend offline · demo mode'}
          </div>
        </div>
      </aside>
    </>
  )
}
