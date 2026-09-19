export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-surface-card border border-surface-border flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-gray-500" />
        </div>
      )}
      <h3 className="text-gray-200 font-medium mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
