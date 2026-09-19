import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import Home from './pages/Home'
import ControlRoom from './pages/ControlRoom'
import ToolRegistry from './pages/ToolRegistry'
import RunHistory from './pages/RunHistory'
import { useBackendConnection } from './hooks/useSocket'

const TITLES = {
  '/': 'Home',
  '/control-room': 'Control Room',
  '/tools': 'Tool Registry',
  '/history': 'Run History',
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const connected = useBackendConnection()

  return (
    <div className="min-h-screen flex bg-surface">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} connected={connected} />

      <div className="flex-1 min-w-0 flex flex-col">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          connected={connected}
          title="Internet Control Room"
        />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/control-room" element={<ControlRoom />} />
            <Route path="/control-room/:runId" element={<ControlRoom />} />
            <Route path="/tools" element={<ToolRegistry />} />
            <Route path="/history" element={<RunHistory />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <h1 className="text-2xl font-bold text-gray-100 mb-2">Page not found</h1>
      <p className="text-gray-500 text-sm">The page you're looking for doesn't exist.</p>
    </div>
  )
}
