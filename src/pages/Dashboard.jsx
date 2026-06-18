import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Clock, CheckCircle, ListOrdered, FilePlus, ArrowRight } from 'lucide-react'
import { getSolicitudes } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import StatCard from '../components/StatCard'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'

export default function Dashboard() {
  const { getEstudiante } = useAuth()
  const { id: estudianteId, nombre } = getEstudiante()

  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSolicitudes()
      .then(({ data }) => {
        const mine = (data || []).filter(
          s => String(s.estudiante_id) === String(estudianteId)
        )
        setSolicitudes(mine)
      })
      .catch(() => setSolicitudes([]))
      .finally(() => setLoading(false))
  }, [estudianteId])

  const pendientes  = solicitudes.filter(s => s.estado === 'PENDIENTE').length
  const respondidas = solicitudes.filter(s => s.estado === 'RESPONDIDA').length

  const firstName = nombre?.split(' ')[0] || 'Estudiante'

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <PageHeader
        title={`Hola, ${firstName} 👋`}
        description="Aquí tienes un resumen de tus tutorías."
        action={
          <Link to="/solicitudes/nueva" className="btn-primary">
            <FilePlus size={15} />
            Nueva solicitud
          </Link>
        }
      />

      {/* Stats */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard
              label="Total solicitudes"
              value={solicitudes.length}
              icon={ListOrdered}
              accent="brand"
            />
            <StatCard
              label="Pendientes"
              value={pendientes}
              icon={Clock}
              accent="amber"
            />
            <StatCard
              label="Respondidas"
              value={respondidas}
              icon={CheckCircle}
              accent="emerald"
            />
          </div>

          {/* Recent activity */}
          <div className="card">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-slate-400" />
                <h2 className="text-sm font-semibold text-slate-800">Solicitudes recientes</h2>
              </div>
              <Link
                to="/mis-solicitudes"
                className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
              >
                Ver todas <ArrowRight size={12} />
              </Link>
            </div>

            {solicitudes.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-sm text-slate-500">Aún no tienes solicitudes.</p>
                <Link to="/solicitudes/nueva" className="btn-primary mt-4 inline-flex">
                  <FilePlus size={15} />
                  Crear primera solicitud
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {solicitudes.slice(0, 5).map((s) => (
                  <div key={s.id} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800 truncate">{s.pregunta}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {s.fecha ? new Date(s.fecha).toLocaleDateString('es-CO', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        }) : '—'}
                      </p>
                    </div>
                    <span className={s.estado === 'PENDIENTE' ? 'badge-pending' : 'badge-answered'}>
                      {s.estado === 'PENDIENTE' ? '⏳' : '✓'} {s.estado}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
