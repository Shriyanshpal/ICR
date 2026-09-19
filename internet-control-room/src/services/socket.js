// socket.js
// -----------------------------------------------------------------------
// Centralized Socket.IO client wrapper. Components never import
// socket.io-client directly — they go through the useSocket() hook,
// which itself talks to this module.
//
// In mock mode, this module is bypassed entirely by useSocket, which
// instead drives events from mockService's simulateAgentRun/resolveApproval.
// -----------------------------------------------------------------------

import { io } from 'socket.io-client'
import { API_BASE_URL } from '../utils/constants'

let socket = null

export function getSocket() {
  if (!socket) {
    socket = io(API_BASE_URL, {
      autoConnect: false,
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })
  }
  return socket
}

export function connectSocket() {
  const s = getSocket()
  if (!s.connected) s.connect()
  return s
}

export function disconnectSocket() {
  if (socket && socket.connected) socket.disconnect()
}
