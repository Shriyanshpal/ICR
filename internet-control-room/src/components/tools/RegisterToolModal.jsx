import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import Button from '../common/Button'
import { AUTH_TYPES, HTTP_METHODS } from '../../utils/constants'

const EMPTY_PARAM = { name: '', type: 'text', required: false }

export default function RegisterToolModal({ open, onClose, onSubmit, submitting }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    endpoint: '',
    method: 'GET',
    authType: 'None',
  })
  const [params, setParams] = useState([{ ...EMPTY_PARAM }])

  if (!open) return null

  const updateField = (field, value) => setForm((f) => ({ ...f, [field]: value }))
  const updateParam = (idx, field, value) =>
    setParams((p) => p.map((row, i) => (i === idx ? { ...row, [field]: value } : row)))
  const addParam = () => setParams((p) => [...p, { ...EMPTY_PARAM }])
  const removeParam = (idx) => setParams((p) => p.filter((_, i) => i !== idx))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.endpoint.trim()) return
    onSubmit({
      ...form,
      actions: [`${form.method} ${form.endpoint}`],
      parameters: params.filter((p) => p.name.trim()),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-tool-title"
        className="relative bg-surface-card border border-surface-border rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-fade-in"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="register-tool-title" className="font-semibold text-gray-100">
            Register New Tool
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-200 focus-ring rounded p-1"
            aria-label="Close"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Tool Name" htmlFor="tool-name">
            <input
              id="tool-name"
              className="input"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              required
            />
          </Field>

          <Field label="Description" htmlFor="tool-desc">
            <textarea
              id="tool-desc"
              className="input min-h-[70px] resize-none"
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="HTTP Method" htmlFor="tool-method" className="col-span-1">
              <select
                id="tool-method"
                className="input"
                value={form.method}
                onChange={(e) => updateField('method', e.target.value)}
              >
                {HTTP_METHODS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </Field>
            <Field label="Endpoint" htmlFor="tool-endpoint" className="col-span-2">
              <input
                id="tool-endpoint"
                className="input font-mono"
                placeholder="/v1/resource"
                value={form.endpoint}
                onChange={(e) => updateField('endpoint', e.target.value)}
                required
              />
            </Field>
          </div>

          <Field label="Authentication Type" htmlFor="tool-auth">
            <select
              id="tool-auth"
              className="input"
              value={form.authType}
              onChange={(e) => updateField('authType', e.target.value)}
            >
              {AUTH_TYPES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </Field>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">Parameters</span>
              <Button type="button" variant="ghost" size="sm" icon={Plus} onClick={addParam}>
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {params.map((param, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    className="input flex-1"
                    placeholder="Parameter name"
                    value={param.name}
                    onChange={(e) => updateParam(idx, 'name', e.target.value)}
                  />
                  <select
                    className="input w-24"
                    value={param.type}
                    onChange={(e) => updateParam(idx, 'type', e.target.value)}
                  >
                    <option value="text">text</option>
                    <option value="number">number</option>
                    <option value="boolean">boolean</option>
                  </select>
                  <label className="flex items-center gap-1.5 text-xs text-gray-400 shrink-0">
                    <input
                      type="checkbox"
                      checked={param.required}
                      onChange={(e) => updateParam(idx, 'required', e.target.checked)}
                      className="accent-accent"
                    />
                    Required
                  </label>
                  <button
                    type="button"
                    onClick={() => removeParam(idx)}
                    className="text-gray-500 hover:text-danger focus-ring rounded p-1 shrink-0"
                    aria-label="Remove parameter"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1" loading={submitting}>
              Register Tool
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, htmlFor, children, className = '' }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-300 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}
