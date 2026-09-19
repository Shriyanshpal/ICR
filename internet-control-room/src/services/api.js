// api.js
// -----------------------------------------------------------------------
// Centralized place for every real backend HTTP call. Components must
// never call axios/fetch directly — they go through these functions.
// -----------------------------------------------------------------------

import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// POST /api/agent/run
export async function runAgent(goal) {
  const { data } = await client.post('/api/agent/run', { goal })
  return data // { runId }
}

// GET /api/agent/:runId
export async function getAgentRun(runId) {
  const { data } = await client.get(`/api/agent/${runId}`)
  return data
}

// POST /api/agent/:runId/approve
export async function approveAgent(runId, approved) {
  const { data } = await client.post(`/api/agent/${runId}/approve`, { approved })
  return data
}

// GET /api/tools
export async function getTools() {
  const { data } = await client.get('/api/tools')
  return data
}

// POST /api/tools
export async function registerTool(tool) {
  const { data } = await client.post('/api/tools', tool)
  return data
}

// GET /api/runs  (run history — not explicitly in the contract but assumed
// to follow the same pattern; falls back to mock data if unavailable)
export async function listRunHistory() {
  const { data } = await client.get('/api/runs')
  return data
}

export default client
