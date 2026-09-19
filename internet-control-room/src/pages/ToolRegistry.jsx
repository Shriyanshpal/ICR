import { useEffect, useState, useCallback } from 'react'
import { Plus, Wrench } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import ToolCard from '../components/tools/ToolCard'
import RegisterToolModal from '../components/tools/RegisterToolModal'
import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'
import { Skeleton } from '../components/common/LoadingState'
import { getTools as apiGetTools, registerTool as apiRegisterTool } from '../services/api'
import { mockGetTools, mockRegisterTool } from '../services/mockService'
import { USE_MOCK } from '../utils/constants'

export default function ToolRegistry() {
  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const loadTools = useCallback(async () => {
    setLoading(true)
    try {
      const fetcher = USE_MOCK ? mockGetTools : apiGetTools
      const data = await fetcher()
      setTools(data)
    } catch (err) {
      setError(err.message || 'Failed to load tools')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTools()
  }, [loadTools])

  const handleRegister = async (tool) => {
    setSubmitting(true)
    try {
      const registerFn = USE_MOCK ? mockRegisterTool : apiRegisterTool
      const newTool = await registerFn(tool)
      setTools((prev) => [newTool, ...prev])
      setModalOpen(false)
    } catch (err) {
      setError(err.message || 'Failed to register tool')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
        <div>
          <h1 className="text-xl font-bold text-gray-50 tracking-tight">Tool Registry</h1>
          <p className="text-sm text-gray-500 mt-1">Registered tools available to the agent</p>
        </div>
        <Button icon={Plus} onClick={() => setModalOpen(true)}>
          Register New Tool
        </Button>
      </div>

      {error && <p className="text-sm text-danger mt-4">{error}</p>}

      <div className="mt-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))}
          </div>
        ) : tools.length === 0 ? (
          <EmptyState
            icon={Wrench}
            title="No tools registered"
            description="Register a tool to make it available to the agent."
            action={
              <Button icon={Plus} onClick={() => setModalOpen(true)}>
                Register New Tool
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </div>

      <RegisterToolModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleRegister}
        submitting={submitting}
      />
    </PageContainer>
  )
}
