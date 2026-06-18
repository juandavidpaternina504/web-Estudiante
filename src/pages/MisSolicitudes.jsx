import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FilePlus, RefreshCw, Clock, CheckCircle, ChevronRight } from 'lucide-react'
import { getSolicitudes, getTutores } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import Spinner from '../components/Spinner'
import Alert from '../components/Alert'

export default function MisSolicitudes() {
  const { getEstudiante } = useAuth()
  const { id: estudianteId } = getEstudiante()

  const [solicitudes, setSolicitudes] = useState([])
  const [tutoresMap, setTutoresMap]   = useState({})
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')
  const [filter, setFilter]           = useState('TODAS')

  const load = () => {
    setLoading(true)
    setError('')
    Promise.all([getSolicitudes(), getTutores()])
      .then(([solRes, tutRes]) => {
        const mine = (solRes.data || [])
          .filter(s => String(s.estudiante_id) === String(estudianteId))
          .sort((a, b) => new Date(b.fecha_solicitud) - new Date(a.fecha_solicitud))

        const map = {}
        ;(tutRes.data || []).forEach(t => { map[t.id] = t.nombre })

        setSolicitudes(mine)
        setTutoresMap(map)
      })
      .catch(() => setError('No se pudieron cargar las solicitudes.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [estudianteId])

  const filtered = filter === 'TODAS'
    ? solicitudes
    : solicitudes.filter(s => s.estado === filter)

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <PageHeader
        title="Mis Solicitudes"
        description="Haz clic en una pregunta para ver su respuesta."
        action={
          <div className="flex items-center gap-2">
            <button onClick={load} className="btn-secondary" title="Actualizar">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
            <Link to="/solicitudes/nueva" className="btn-primary">
              <FilePlus size={14} /> Nueva
            </Link>
          </div>
        }
      />

      {/* Filtros */}
      <div className="flex gap-1 mb-5 bg-slate-100 p-1 rounded-lg w-fit">
        {['TODAS', 'PENDIENTE', 'RESPONDIDA'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
              filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {f === 'TODAS' ? `Todas (${solicitudes.length})` : f}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-5">
          <Alert type="error" message={error} onClose={() => setError('')} />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            title="Sin solicitudes"
            description={filter === 'TODAS' ? 'Aún no has enviado preguntas.' : `No tienes solicitudes con estado ${filter}.`}
            action={filter === 'TODAS' && (
              <Link to="/solicitudes/nueva" className="btn-primary">
                <FilePlus size={14} /> Crear solicitud
              </Link>
            )}
          />
        </div>
      ) : (
        <div className="card overflow-hidden">
          {/* Header tabla */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100">
            <div className="col-span-1 text-xs font-semibold text-slate-500 uppercase tracking-wide">#</div>
            <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Fecha</div>
            <div className="col-span-5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Pregunta</div>
            <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Docente</div>
            <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Estado</div>
          </div>

          <div className="divide-y divide-slate-100">
            {filtered.map((s) => (
              <Link
                key={s.id}
                to={`/solicitudes/${s.id}`}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-5 py-4 hover:bg-slate-50 transition-colors group"
              >
                {/* # */}
                <div className="hidden sm:flex col-span-1 items-center">
                  <span className="text-xs font-mono text-slate-400">#{s.id}</span>
                </div>

                {/* Fecha */}
                <div className="hidden sm:flex col-span-2 items-center">
                  <span className="text-xs text-slate-500">
                    {s.fecha_solicitud
                      ? new Date(s.fecha_solicitud + 'T00:00:00').toLocaleDateString('es-CO', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })
                      : '—'}
                  </span>
                </div>

                {/* Pregunta */}
                <div className="sm:col-span-5 flex items-center gap-2 min-w-0">
                  <span className="text-sm text-slate-800 group-hover:text-brand-600 font-medium transition-colors truncate">
                    {s.pregunta}
                  </span>
                  <ChevronRight size={13} className="text-slate-300 group-hover:text-brand-400 flex-shrink-0 transition-colors" />
                </div>

                {/* Docente */}
                <div className="hidden sm:flex col-span-2 items-center">
                  {s.tutor_id && tutoresMap[s.tutor_id] ? (
                    <span className="text-xs text-slate-700 font-medium truncate">
                      {tutoresMap[s.tutor_id]}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-300">—</span>
                  )}
                </div>

                {/* Mobile: id + fecha + estado */}
                <div className="flex sm:hidden items-center justify-between">
                  <span className="text-xs text-slate-400">
                    #{s.id} · {s.fecha_solicitud
                      ? new Date(s.fecha_solicitud + 'T00:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })
                      : '—'}
                  </span>
                  <span className={s.estado === 'PENDIENTE' ? 'badge-pending' : 'badge-answered'}>
                    {s.estado === 'PENDIENTE' ? <><Clock size={10} /> Pendiente</> : <><CheckCircle size={10} /> Respondida</>}
                  </span>
                </div>

                {/* Estado desktop */}
                <div className="hidden sm:flex col-span-2 items-center">
                  <span className={s.estado === 'PENDIENTE' ? 'badge-pending' : 'badge-answered'}>
                    {s.estado === 'PENDIENTE'
                      ? <><Clock size={10} /> Pendiente</>
                      : <><CheckCircle size={10} /> Respondida</>}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
            <p className="text-xs text-slate-400">
              Mostrando {filtered.length} de {solicitudes.length} solicitudes
            </p>
          </div>
        </div>
      )}
    </div>
  )
}