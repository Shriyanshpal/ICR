import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Satellite, ArrowRight, Target, Wrench, PlayCircle, ShieldCheck, RotateCcw, ShieldAlert } from 'lucide-react'
import Button from '../components/common/Button'
import PageContainer from '../components/layout/PageContainer'
import { runAgent as apiRunAgent } from '../services/api'
import { mockRunAgent } from '../services/mockService'
import { USE_MOCK, EXAMPLE_GOALS } from '../utils/constants'

const FEATURES = [
  { icon: Target, title: 'PLAN', desc: 'Break complex goals into executable tasks.' },
  { icon: Wrench, title: 'TOOLS', desc: 'Select the right API or service for the job.' },
  { icon: PlayCircle, title: 'EXECUTE', desc: 'Run tasks while maintaining full state.' },
  { icon: ShieldCheck, title: 'VERIFY', desc: 'Validate results before continuing.' },
  { icon: RotateCcw, title: 'RECOVER', desc: 'Handle failures and fallback strategies.' },
  { icon: ShieldAlert, title: 'APPROVE', desc: 'Request human confirmation when needed.' },
]

export default function Home() {
  const [goal, setGoal] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRun = async () => {
    if (!goal.trim()) {
      setError('Enter a goal before running the agent.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const runner = USE_MOCK ? mockRunAgent : apiRunAgent
      const { runId } = await runner(goal.trim())
      navigate(`/control-room/${runId}`)
    } catch (err) {
      setError(err.message || 'Failed to start the agent. Please try again.')
      setLoading(false)
    }
  }

  return (
    <PageContainer>
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto pt-6 pb-10">
        <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-5">
          <Satellite className="w-7 h-7 text-accent-bright" />
        </div>
        <p className="text-xs font-medium text-accent-bright uppercase tracking-wide mb-2">
          AI Agent Operations &amp; Execution Control
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-50 tracking-tight mb-4">
          Give the agent a goal. Watch it execute.
        </h1>
        <p className="text-gray-400 leading-relaxed">
          The control room visualizes how an AI agent plans tasks, selects tools, executes
          actions, verifies results, and recovers from failures — in real time.
        </p>
      </div>

      {/* Goal input */}
      <div className="max-w-2xl mx-auto bg-surface-card border border-surface-border rounded-xl p-5 sm:p-6 mb-10">
        <label htmlFor="goal-input" className="sr-only">
          What do you want the agent to accomplish?
        </label>
        <textarea
          id="goal-input"
          className="input min-h-[100px] resize-none text-base"
          placeholder="What do you want the agent to accomplish?"
          value={goal}
          onChange={(e) => {
            setGoal(e.target.value)
            if (error) setError('')
          }}
        />
        {error && <p className="text-sm text-danger mt-2">{error}</p>}

        <div className="flex flex-wrap gap-2 mt-4">
          {EXAMPLE_GOALS.map((example) => (
            <button
              key={example}
              onClick={() => setGoal(example)}
              className="focus-ring text-xs text-left text-gray-400 hover:text-gray-100 bg-surface-raised hover:bg-surface-border border border-surface-border rounded-lg px-3 py-1.5 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>

        <Button
          className="w-full mt-5"
          size="lg"
          icon={ArrowRight}
          onClick={handleRun}
          loading={loading}
        >
          Run Agent
        </Button>
      </div>

      {/* Flow */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-gray-500">
          {['GOAL', 'PLAN', 'TOOLS', 'EXECUTE', 'VERIFY', 'RECOVER'].map((step, i, arr) => (
            <span key={step} className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-surface-card border border-surface-border text-gray-300">
                {step}
              </span>
              {i < arr.length - 1 && <ArrowRight className="w-3 h-3 text-gray-600" />}
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto pb-4">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-surface-card border border-surface-border rounded-xl p-5">
            <Icon className="w-5 h-5 text-accent-bright mb-3" />
            <h3 className="text-sm font-semibold text-gray-200 mb-1">{title}</h3>
            <p className="text-sm text-gray-500">{desc}</p>
          </div>
        ))}
      </div>
    </PageContainer>
  )
}
