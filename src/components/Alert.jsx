import { CheckCircle, AlertCircle, X } from 'lucide-react'

export default function Alert({ type = 'success', message, onClose }) {
  const styles = {
    success: {
      wrapper: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />,
    },
    error: {
      wrapper: 'bg-red-50 border-red-200 text-red-800',
      icon: <AlertCircle size={16} className="text-red-500 flex-shrink-0" />,
    },
  }
  const s = styles[type]

  return (
    <div className={`flex items-start gap-2.5 px-4 py-3 rounded-lg border text-sm ${s.wrapper}`}>
      {s.icon}
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity">
          <X size={14} />
        </button>
      )}
    </div>
  )
}
