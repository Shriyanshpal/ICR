// mockService.js
// -----------------------------------------------------------------------
// Self-contained mock backend used only for frontend demonstration when
// the real Node/Express backend + Socket.IO server is unavailable.
// Everything fake lives here — no other file should contain fake logic.
// -----------------------------------------------------------------------

import { AGENT_STATUS, TASK_STATUS } from '../utils/constants'

let idCounter = 1
function nextId(prefix) {
  return `${prefix}_${Date.now().toString(36)}${(idCounter++).toString(36)}`
}

// ---------------------------------------------------------------------
// Mock tool registry
// ---------------------------------------------------------------------
export const MOCK_TOOLS = [
  {
    id: 'tool_weather',
    name: 'Weather API',
    description: 'Get current weather and forecast data for any city.',
    status: 'active',
    authType: 'API Key',
    actions: ['GET /weather', 'GET /forecast'],
  },
  {
    id: 'tool_search',
    name: 'Web Search',
    description: 'Search the public web for up-to-date information.',
    status: 'active',
    authType: 'API Key',
    actions: ['GET /search'],
  },
  {
    id: 'tool_news',
    name: 'News API',
    description: 'Fetch recent news articles by topic or keyword.',
    status: 'active',
    authType: 'Bearer Token',
    actions: ['GET /headlines', 'GET /everything'],
  },
  {
    id: 'tool_email',
    name: 'Email Service',
    description: 'Send transactional or summary emails on behalf of the agent.',
    status: 'inactive',
    authType: 'OAuth 2.0',
    actions: ['POST /send'],
  },
  {
    id: 'tool_maps',
    name: 'Maps API',
    description: 'Geocode locations and calculate routes/distances.',
    status: 'active',
    authType: 'API Key',
    actions: ['GET /geocode', 'GET /directions'],
  },
]

// ---------------------------------------------------------------------
// In-memory run store (simulates a backend database for this session)
// ---------------------------------------------------------------------
const runStore = new Map()

function buildTaskPlan(goal) {
  return [
    {
      id: nextId('task'),
      name: 'Understand goal',
      description: 'Parse the user goal and identify the required capabilities.',
      status: TASK_STATUS.PENDING,
      tool: null,
      startedAt: null,
      executionTimeMs: null,
      result: null,
      error: null,
    },
    {
      id: nextId('task'),
      name: 'Research information',
      description: 'Search for relevant, current information related to the goal.',
      status: TASK_STATUS.PENDING,
      tool: 'Web Search',
      startedAt: null,
      executionTimeMs: null,
      result: null,
      error: null,
    },
    {
      id: nextId('task'),
      name: 'Call external API',
      description: 'Fetch weather data',
      status: TASK_STATUS.PENDING,
      tool: 'Weather API',
      startedAt: null,
      executionTimeMs: null,
      result: null,
      error: null,
    },
    {
      id: nextId('task'),
      name: 'Verify information',
      description: 'Cross-check retrieved data for accuracy and completeness.',
      status: TASK_STATUS.PENDING,
      tool: null,
      startedAt: null,
      executionTimeMs: null,
      result: null,
      error: null,
    },
    {
      id: nextId('task'),
      name: 'Send summary email',
      description: 'Send the final summary to the user via email.',
      status: TASK_STATUS.PENDING,
      tool: 'Email Service',
      startedAt: null,
      executionTimeMs: null,
      result: null,
      error: null,
      requiresApproval: true,
    },
    {
      id: nextId('task'),
      name: 'Generate final response',
      description: 'Compose a clear, human-readable final answer.',
      status: TASK_STATUS.PENDING,
      tool: null,
      startedAt: null,
      executionTimeMs: null,
      result: null,
      error: null,
    },
  ]
}

function createRun(goal) {
  const runId = nextId('run')
  const run = {
    runId,
    goal,
    status: AGENT_STATUS.PLANNING,
    tasks: [],
    logs: [],
    createdAt: new Date().toISOString(),
    startedAt: new Date().toISOString(),
    completedAt: null,
    finalResult: null,
    stats: { toolsUsed: new Set(), recoveredTasks: 0, failedTasks: 0 },
  }
  runStore.set(runId, run)
  return run
}

export function getRun(runId) {
  return runStore.get(runId) || null
}

export function listRuns() {
  return Array.from(runStore.values())
}

// ---------------------------------------------------------------------
// Public mock API — mirrors services/api.js function signatures
// ---------------------------------------------------------------------
export async function mockRunAgent(goal) {
  await delay(400)
  const run = createRun(goal)
  return { runId: run.runId }
}

export async function mockGetAgentRun(runId) {
  await delay(150)
  const run = getRun(runId)
  if (!run) throw new Error('Run not found')
  return sanitizeRun(run)
}

export async function mockGetTools() {
  await delay(300)
  return MOCK_TOOLS
}

export async function mockRegisterTool(tool) {
  await delay(400)
  const newTool = {
    id: nextId('tool'),
    status: 'active',
    ...tool,
  }
  MOCK_TOOLS.unshift(newTool)
  return newTool
}

export async function mockListRunHistory() {
  await delay(250)
  return listRuns().map(sanitizeRun)
}

export async function mockApproveAgent(runId, approved) {
  await delay(300)
  const run = getRun(runId)
  if (!run) throw new Error('Run not found')
  return { runId, approved }
}

function sanitizeRun(run) {
  return {
    ...run,
    stats: {
      toolsUsed: run.stats.toolsUsed.size,
      recoveredTasks: run.stats.recoveredTasks,
      failedTasks: run.stats.failedTasks,
    },
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ---------------------------------------------------------------------
// Simulated Socket.IO event stream
// Drives a full GOAL -> PLAN -> EXECUTE -> VERIFY -> RECOVER -> RESULT
// sequence, emitting events through the same callback shape the real
// socket.js would use: emit(eventName, payload)
// ---------------------------------------------------------------------
export function simulateAgentRun(runId, emit) {
  const run = getRun(runId)
  if (!run) return () => {}

  let cancelled = false
  const timers = []
  const wait = (fn, ms) => {
    const t = setTimeout(() => {
      if (!cancelled) fn()
    }, ms)
    timers.push(t)
  }

  const log = (message, level = 'info') => {
    const entry = { timestamp: new Date().toISOString(), message, level }
    run.logs.push(entry)
    emit('log', entry)
  }

  let t = 300

  wait(() => {
    run.status = AGENT_STATUS.PLANNING
    emit('agent_started', { runId, status: run.status })
    log('Goal received')
  }, t)

  t += 600
  wait(() => {
    log('Creating execution plan')
  }, t)

  t += 900
  wait(() => {
    const tasks = buildTaskPlan(run.goal)
    run.tasks = tasks
    run.status = AGENT_STATUS.RUNNING
    emit('plan_created', { runId, tasks })
    log('Execution plan created')
  }, t)

  // Task 1: Understand goal — quick success
  t += 700
  wait(() => runTask(0, { durationMs: 900, outcome: 'success', result: 'Goal parsed: fetch + summarize Delhi weather.' }), t)
  t += 1100

  // Task 2: Research — quick success
  wait(() => runTask(1, { durationMs: 1200, outcome: 'success', result: 'Found 3 relevant sources on current conditions.' }), t)
  t += 1400

  // Task 3: Call external API — fails once, recovers, then succeeds
  wait(() => runTask(2, { durationMs: 1800, outcome: 'fail_then_recover', result: 'Delhi: 31°C, clear skies, light haze in the evening.' }), t)
  t += 3600

  // Task 4: Verify — success
  wait(() => runTask(3, { durationMs: 1000, outcome: 'success', result: 'Data cross-checked against secondary source. Consistent.' }), t)
  t += 1300

  // Task 5: Send summary email — requires approval
  wait(() => {
    run.status = AGENT_STATUS.WAITING_APPROVAL
    const task = run.tasks[4]
    task.status = TASK_STATUS.WAITING_APPROVAL
    task.startedAt = new Date().toISOString()
    emit('task_started', { runId, task })
    log(`Approval required before running "${task.name}"`, 'warn')
    emit('approval_required', {
      runId,
      task,
      action: 'Send request using External API',
      reason: 'This action requires human confirmation before execution.',
    })
  }, t)

  // Note: approval resolution is driven externally via resolveApproval()
  // The remaining steps (email send + final response) are queued there.

  const cancel = () => {
    cancelled = true
    timers.forEach(clearTimeout)
  }

  function runTask(index, { durationMs, outcome, result }) {
    const task = run.tasks[index]
    task.status = TASK_STATUS.RUNNING
    task.startedAt = new Date().toISOString()
    if (task.tool) run.stats.toolsUsed.add(task.tool)
    emit('task_started', { runId, task })
    log(`${task.tool ? `${task.tool} selected — ` : ''}${task.name}`)

    if (task.name.toLowerCase().includes('verify')) {
      emit('verification_started', { runId, task })
      run.status = AGENT_STATUS.VERIFYING
    }

    if (outcome === 'success') {
      wait(() => {
        task.status = TASK_STATUS.COMPLETED
        task.executionTimeMs = durationMs
        task.result = result
        run.status = AGENT_STATUS.RUNNING
        emit('task_completed', { runId, task })
        log(`${task.name} completed`, 'success')
        if (task.name.toLowerCase().includes('verify')) {
          emit('verification_completed', { runId, task, result })
          log('Verification successful', 'success')
        }
      }, durationMs)
    } else if (outcome === 'fail_then_recover') {
      wait(() => {
        task.status = TASK_STATUS.FAILED
        task.error = `${task.tool} returned 503 Service Unavailable`
        task.retryCount = 1
        task.maxRetries = 3
        task.recoveryStrategy = 'Retry with exponential backoff'
        task.fallbackTool = 'OpenWeather Alternative'
        run.status = AGENT_STATUS.RECOVERING
        run.stats.failedTasks += 1
        emit('task_failed', { runId, task })
        log(`${task.tool} failed: 503 Service Unavailable`, 'error')
        emit('recovery_started', { runId, task })
        log('Recovery initiated — retrying with exponential backoff', 'warn')

        wait(() => {
          task.retryCount = 2
          task.status = TASK_STATUS.RECOVERING
          emit('task_started', { runId, task })
          log(`Retry ${task.retryCount}/${task.maxRetries} using fallback: ${task.fallbackTool}`, 'warn')

          wait(() => {
            task.status = TASK_STATUS.COMPLETED
            task.executionTimeMs = durationMs
            task.result = result
            task.error = null
            run.status = AGENT_STATUS.RUNNING
            run.stats.recoveredTasks += 1
            emit('task_completed', { runId, task })
            log(`${task.name} completed after recovery`, 'success')
          }, 1200)
        }, 1000)
      }, Math.round(durationMs * 0.5))
    }
  }

  return { cancel, log, run }
}

export function resolveApproval(runId, approved, emit) {
  const run = getRun(runId)
  if (!run) return

  const log = (message, level = 'info') => {
    const entry = { timestamp: new Date().toISOString(), message, level }
    run.logs.push(entry)
    emit('log', entry)
  }

  const task = run.tasks[4]

  if (!approved) {
    task.status = TASK_STATUS.FAILED
    task.error = 'Rejected by human operator'
    run.status = AGENT_STATUS.FAILED
    run.stats.failedTasks += 1
    log('Action rejected by human operator', 'error')
    emit('task_failed', { runId, task })
    emit('agent_failed', { runId, reason: 'Human operator rejected a required action.' })
    return
  }

  task.status = TASK_STATUS.RUNNING
  run.status = AGENT_STATUS.RUNNING
  emit('task_started', { runId, task })
  log('Approval granted — sending summary email', 'success')
  if (task.tool) run.stats.toolsUsed.add(task.tool)

  setTimeout(() => {
    task.status = TASK_STATUS.COMPLETED
    task.executionTimeMs = 650
    task.result = 'Summary email sent successfully.'
    emit('task_completed', { runId, task })
    log('Summary email sent', 'success')

    // Final task: generate response
    const finalTask = run.tasks[5]
    finalTask.status = TASK_STATUS.RUNNING
    finalTask.startedAt = new Date().toISOString()
    emit('task_started', { runId, finalTask })
    log('Generating final response')

    setTimeout(() => {
      finalTask.status = TASK_STATUS.COMPLETED
      finalTask.executionTimeMs = 800
      const output = `Delhi is expected to have clear skies with a high of 31°C today. Light haze is possible in the evening; overall conditions are favorable with low chance of rain.`
      finalTask.result = output
      run.status = AGENT_STATUS.COMPLETED
      run.completedAt = new Date().toISOString()
      run.finalResult = output
      emit('task_completed', { runId, task: finalTask })
      log('Final response generated', 'success')
      emit('agent_completed', { runId, result: sanitizeRun(run) })
      log('Agent run completed', 'success')
    }, 900)
  }, 650)
}
