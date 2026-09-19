// useSocket.js
// -----------------------------------------------------------------------
// Reusable hook that centralizes Socket.IO subscription logic so
// components never talk to socket.io-client directly.
//
// In mock mode (USE_MOCK=true) it drives simulated events from
// mockService instead of a real socket connection, but exposes the
// exact same subscribe/emit-received API to consumers.
// -----------------------------------------------------------------------

import { useEffect, useRef, useCallback, useState } from 'react'
import { connectSocket, disconnectSocket, getSocket } from '../services/socket'
import { simulateAgentRun, resolveApproval } from '../services/mockService'
import { USE_MOCK, SOCKET_EVENTS } from '../utils/constants'

export function useSocket(runId) {
  const [connected, setConnected] = useState(USE_MOCK ? true : false)
  const listenersRef = useRef({})
  const mockControllerRef = useRef(null)

  const emitToListeners = useCallback((event, payload) => {
    const handlers = listenersRef.current[event] || []
    handlers.forEach((h) => h(payload))
  }, [])

  const on = useCallback((event, handler) => {
    if (!listenersRef.current[event]) listenersRef.current[event] = []
    listenersRef.current[event].push(handler)
    return () => {
      listenersRef.current[event] = listenersRef.current[event].filter((h) => h !== handler)
    }
  }, [])

  useEffect(() => {
    if (!runId) return

    if (USE_MOCK) {
      setConnected(true)
      mockControllerRef.current = simulateAgentRun(runId, emitToListeners)
      return () => {
        mockControllerRef.current?.cancel?.()
      }
    }

    const socket = connectSocket()
    setConnected(socket.connected)

    const handleConnect = () => setConnected(true)
    const handleDisconnect = () => setConnected(false)

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)

    Object.values(SOCKET_EVENTS).forEach((eventName) => {
      socket.on(eventName, (payload) => emitToListeners(eventName, payload))
    })
    socket.on('log', (payload) => emitToListeners('log', payload))

    socket.emit('subscribe_run', { runId })

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      Object.values(SOCKET_EVENTS).forEach((eventName) => socket.off(eventName))
      socket.off('log')
    }
  }, [runId, emitToListeners])

  const sendApproval = useCallback(
    (approved) => {
      if (USE_MOCK) {
        resolveApproval(runId, approved, emitToListeners)
        return
      }
      const socket = getSocket()
      socket.emit('approval_response', { runId, approved })
    },
    [runId, emitToListeners]
  )

  return { connected, on, sendApproval }
}

export function useBackendConnection() {
  const [connected, setConnected] = useState(USE_MOCK ? true : false)

  useEffect(() => {
    if (USE_MOCK) {
      setConnected(true)
      return
    }
    const socket = connectSocket()
    const handleConnect = () => setConnected(true)
    const handleDisconnect = () => setConnected(false)
    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    setConnected(socket.connected)
    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
    }
  }, [])

  return connected
}
