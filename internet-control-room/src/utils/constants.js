// Centralized constants used across the app

export const AGENT_STATUS = {
  PLANNING: 'planning',
  RUNNING: 'running',
  VERIFYING: 'verifying',
  RECOVERING: 'recovering',
  WAITING_APPROVAL: 'waiting_approval',
  COMPLETED: 'completed',
  FAILED: 'failed',
}

export const TASK_STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  RECOVERING: 'recovering',
  WAITING_APPROVAL: 'waiting_approval',
}

export const SOCKET_EVENTS = {
  AGENT_STARTED: 'agent_started',
  PLAN_CREATED: 'plan_created',
  TASK_STARTED: 'task_started',
  TASK_COMPLETED: 'task_completed',
  TASK_FAILED: 'task_failed',
  VERIFICATION_STARTED: 'verification_started',
  VERIFICATION_COMPLETED: 'verification_completed',
  RECOVERY_STARTED: 'recovery_started',
  APPROVAL_REQUIRED: 'approval_required',
  AGENT_COMPLETED: 'agent_completed',
  AGENT_FAILED: 'agent_failed',
}

export const AUTH_TYPES = ['None', 'API Key', 'Bearer Token', 'OAuth 2.0', 'Basic Auth']

export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

export const USE_MOCK = String(import.meta.env.VITE_USE_MOCK ?? 'true') === 'true'

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const EXAMPLE_GOALS = [
  'Find the weather in Delhi and summarize the forecast',
  'Research the latest AI developments and create a summary',
  'Compare three travel options and recommend based on my criteria',
]
