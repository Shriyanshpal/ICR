// useAgentRun.js
// -----------------------------------------------------------------------
// Owns all state for a single agent run: status, tasks, logs, tool
// execution info, approval requests, and the final result. Wires up
// useSocket() to update that state as events arrive.
// -----------------------------------------------------------------------

import { useEffect, useReducer, useCallback } from 'react'
import { useSocket } from './useSocket'
import { getAgentRun as apiGetAgentRun, approveAgent as apiApproveAgent } from '../services/api'
import { mockGetAgentRun, mockApproveAgent } from '../services/mockService'
import { USE_MOCK, AGENT_STATUS, TASK_STATUS } from '../utils/constants'

const initialState = {
  loading: true,
  error: null,
  runId: null,
  goal: '',
  status: AGENT_STATUS.PLANNING,
  tasks: [],
  logs: [],
  currentTask: null,
  lastToolExecution: null,
  approval: null,
  finalResult: null,
  stats: { toolsUsed: 0, recoveredTasks: 0, failedTasks: 0, tasksExecuted: 0 },
  startedAt: null,
  completedAt: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return { ...initialState, loading: false, ...action.payload }
    case 'ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'AGENT_STARTED':
      return { ...state, status: AGENT_STATUS.RUNNING }
    case 'PLAN_CREATED':
      return { ...state, tasks: action.payload.tasks }
    case 'TASK_STARTED': {
      const task = action.payload.task
      if (!task) return state
      const tasks = upsertTask(state.tasks, task)
      return { ...state, tasks, currentTask: task }
    }
    case 'TASK_COMPLETED': {
      const task = action.payload.task
      const tasks = upsertTask(state.tasks, task)
      const isCurrentTaskDone = state.currentTask?.id === task.id
      return {
        ...state,
        tasks,
        currentTask: isCurrentTaskDone ? null : state.currentTask,
        lastToolExecution: task.tool
          ? {
              tool: task.tool,
              status: 'connected',
              requestStatus: '200 OK',
              executionTimeMs: task.executionTimeMs,
              result: 'Success',
            }
          : state.lastToolExecution,
      }
    }
    case 'TASK_FAILED': {
      const task = action.payload.task
      const tasks = upsertTask(state.tasks, task)
      return {
        ...state,
        tasks,
        currentTask: task,
        lastToolExecution: task.tool
          ? {
              tool: task.tool,
              status: 'error',
              requestStatus: '503 Service Unavailable',
              executionTimeMs: task.executionTimeMs,
              result: 'Failed',
            }
          : state.lastToolExecution,
      }
    }
    case 'VERIFICATION_STARTED':
      return { ...state, status: AGENT_STATUS.VERIFYING }
    case 'VERIFICATION_COMPLETED':
      return { ...state, status: AGENT_STATUS.RUNNING }
    case 'RECOVERY_STARTED':
      return { ...state, status: AGENT_STATUS.RECOVERING }
    case 'APPROVAL_REQUIRED':
      return { ...state, status: AGENT_STATUS.WAITING_APPROVAL, approval: action.payload }
    case 'APPROVAL_RESOLVED':
      return { ...state, approval: null }
    case 'AGENT_COMPLETED':
      return {
        ...state,
        status: AGENT_STATUS.COMPLETED,
        finalResult: action.payload.result?.finalResult || action.payload.result,
        completedAt: new Date().toISOString(),
        stats: computeStats(state.tasks, action.payload.result),
      }
    case 'AGENT_FAILED':
      return { ...state, status: AGENT_STATUS.FAILED, error: action.payload.reason }
    case 'LOG':
      return { ...state, logs: [...state.logs, action.payload].slice(-200) }
    case 'CLEAR_LOGS':
      return { ...state, logs: [] }
    default:
      return state
  }
}

function upsertTask(tasks, task) {
  const idx = tasks.findIndex((t) => t.id === task.id)
  if (idx === -1) return [...tasks, task]
  const copy = [...tasks]
  copy[idx] = task
  return copy
}

function computeStats(tasks, result) {
  const completed = tasks.filter((t) => t.status === TASK_STATUS.COMPLETED)
  const failed = tasks.filter((t) => t.status === TASK_STATUS.FAILED)
  const toolsUsed = new Set(tasks.filter((t) => t.tool).map((t) => t.tool))
  return {
    tasksExecuted: completed.length,
    toolsUsed: result?.stats?.toolsUsed ?? toolsUsed.size,
    recoveredTasks: result?.stats?.recoveredTasks ?? 0,
    failedTasks: result?.stats?.failedTasks ?? failed.length,
  }
}

export function useAgentRun(runId) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { connected, on, sendApproval } = useSocket(runId)

  useEffect(() => {
    if (!runId) return
    let cancelled = false
    dispatch({ type: 'INIT', payload: { loading: true, runId } })
    ;(async () => {
      try {
        const fetcher = USE_MOCK ? mockGetAgentRun : apiGetAgentRun
        const run = await fetcher(runId)
        if (cancelled) return
        dispatch({
          type: 'INIT',
          payload: {
            runId,
            goal: run.goal,
            status: run.status,
            tasks: run.tasks || [],
            logs: run.logs || [],
            startedAt: run.startedAt,
          },
        })
      } catch (err) {
        if (!cancelled) dispatch({ type: 'ERROR', payload: err.message || 'Failed to load run' })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [runId])

  useEffect(() => {
    if (!runId) return
    const unsubs = [
      on('agent_started', (p) => dispatch({ type: 'AGENT_STARTED', payload: p })),
      on('plan_created', (p) => dispatch({ type: 'PLAN_CREATED', payload: p })),
      on('task_started', (p) => dispatch({ type: 'TASK_STARTED', payload: p })),
      on('task_completed', (p) => dispatch({ type: 'TASK_COMPLETED', payload: p })),
      on('task_failed', (p) => dispatch({ type: 'TASK_FAILED', payload: p })),
      on('verification_started', (p) => dispatch({ type: 'VERIFICATION_STARTED', payload: p })),
      on('verification_completed', (p) => dispatch({ type: 'VERIFICATION_COMPLETED', payload: p })),
      on('recovery_started', (p) => dispatch({ type: 'RECOVERY_STARTED', payload: p })),
      on('approval_required', (p) => dispatch({ type: 'APPROVAL_REQUIRED', payload: p })),
      on('agent_completed', (p) => dispatch({ type: 'AGENT_COMPLETED', payload: p })),
      on('agent_failed', (p) => dispatch({ type: 'AGENT_FAILED', payload: p })),
      on('log', (p) => dispatch({ type: 'LOG', payload: p })),
    ]
    return () => unsubs.forEach((u) => u && u())
  }, [runId, on])

  const respondToApproval = useCallback(
    async (approved) => {
      dispatch({ type: 'APPROVAL_RESOLVED' })
      try {
        const approver = USE_MOCK ? mockApproveAgent : apiApproveAgent
        await approver(runId, approved)
        sendApproval(approved)
      } catch (err) {
        dispatch({ type: 'ERROR', payload: err.message || 'Failed to send approval' })
      }
    },
    [runId, sendApproval]
  )

  const clearLogs = useCallback(() => dispatch({ type: 'CLEAR_LOGS' }), [])

  return { ...state, connected, respondToApproval, clearLogs }
}
