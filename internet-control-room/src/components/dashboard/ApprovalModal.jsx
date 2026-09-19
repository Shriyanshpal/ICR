import { useEffect, useRef } from 'react'
import { ShieldAlert, X } from 'lucide-react'
import Button from '../common/Button'

export default function ApprovalModal({ approval, onApprove, onReject, loading }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (approval && dialogRef.current) {
      dialogRef.current.focus()
    }
  }, [approval])

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape' && approval) onReject()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [approval, onReject])

  if (!approval) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 animate-fade-in" onClick={onReject} aria-hidden="true" />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="approval-title"
        className="relative bg-surface-card border border-warning/30 rounded-xl w-full max-w-md p-6 animate-fade-in focus:outline-none"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-warning" />
            </div>
            <h2 id="approval-title" className="font-semibold text-gray-100">
              Human Approval Required
            </h2>
          </div>
          <button
            onClick={onReject}
            className="text-gray-500 hover:text-gray-200 focus-ring rounded p-1"
            aria-label="Close"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <p className="text-sm text-gray-400 mb-4">The agent wants to perform this action.</p>

        <div className="space-y-3 text-sm mb-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">Action</p>
            <p className="text-gray-100 font-medium">{approval.action}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Reason</p>
            <p className="text-gray-300">{approval.reason}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onReject} disabled={loading}>
            Reject
          </Button>
          <Button variant="success" className="flex-1" onClick={onApprove} loading={loading}>
            Approve
          </Button>
        </div>
      </div>
    </div>
  )
}
