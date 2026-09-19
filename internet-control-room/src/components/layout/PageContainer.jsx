export default function PageContainer({ children, className = '' }) {
  return (
    <div className={`max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8 ${className}`}>
      {children}
    </div>
  )
}
