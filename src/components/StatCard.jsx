export default function StatCard({ label, value, icon: Icon, accent = 'brand' }) {
  const accentMap = {
    brand:   { bg: 'bg-brand-50',   icon: 'text-brand-600',   text: 'text-brand-700' },
    amber:   { bg: 'bg-amber-50',   icon: 'text-amber-600',   text: 'text-amber-700' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', text: 'text-emerald-700' },
    slate:   { bg: 'bg-slate-100',  icon: 'text-slate-500',   text: 'text-slate-700' },
  }
  const colors = accentMap[accent] || accentMap.brand

  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={20} className={colors.icon} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  )
}
