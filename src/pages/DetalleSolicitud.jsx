import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle, MessageSquare, Video, Calendar } from 'lucide-react'
import { getMisRespuestas } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import Spinner from '../components/Spinner'
import Alert from '../components/Alert'

export default function DetalleSolicitud() {
  const { id } = useParams()
  const { getEstudiante } = useAuth()
  const { id: estudianteId } = getEstudiante()

  const [solicitud, setSolicitud] = useState(null)
  const [respuestas, setRespuestas] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')

  useEffect(() => {
    getMisRespuestas(estudianteId)
      .then(({ data }) => {
        const todas = data || []
        // Filtrar las que corresponden a esta solicitud
        const deEstaSolicitud = todas.filter(r => String(r.solicitud_id) === String(id))
        if (deEstaSolicitud.length > 0) {
          setSolicitud({
            id: deEstaSolicitud[0].solicitud_id,
            pregunta: deEstaSolicitud[0].pregunta,
            estado: deEstaSolicitud[0].estado,
          })
          // Solo las que tienen respuesta real
          const conRespuesta = deEstaSolicitud.filter(r => r.tipo)
          setRespuestas(conRespuesta)
        } else {
          setError('No se encontró esta solicitud.')
        }
      })
      .catch(() => setError('No se pudo cargar el detalle.'))
      .finally(() => setLoading(false))
  }, [id, estudianteId])

  if (loading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      {/* Back */}
      <Link to="/mis-solicitudes" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
        <ArrowLeft size={15} /> Volver a Mis Solicitudes
      </Link>

      {error && <Alert type="error" message={error} />}

      {solicitud && (
        <>
          {/* Pregunta */}
          <div className="card p-6 mb-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Solicitud #{solicitud.id}</p>
                <p className="text-base font-semibold text-slate-800">{solicitud.pregunta}</p>
              </div>
              <span className={solicitud.estado === 'PENDIENTE' ? 'badge-pending flex-shrink-0' : 'badge-answered flex-shrink-0'}>
                {solicitud.estado === 'PENDIENTE'
                  ? <><Clock size={10} /> Pendiente</>
                  : <><CheckCircle size={10} /> Respondida</>}
              </span>
            </div>
          </div>

          {/* Respuestas */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Respuestas del tutor
            </p>

            {respuestas.length === 0 ? (
              <div className="card p-10 text-center">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Clock size={20} className="text-amber-500" />
                </div>
                <p className="text-sm font-semibold text-slate-700 mb-1">Aún sin respuesta</p>
                <p className="text-xs text-slate-400">El tutor responderá tu pregunta pronto. Te notificaremos cuando esté lista.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {respuestas.map((r, i) => (
                  <div key={i} className="card p-5">
                    {r.tipo === 'REUNION' ? (
                      <>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 bg-violet-100 rounded-lg flex items-center justify-center">
                            <Video size={13} className="text-violet-600" />
                          </div>
                          <span className="text-xs font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100">
                            Reunión programada
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 p-3 bg-violet-50 rounded-lg border border-violet-100">
                          <div className="flex items-center gap-1.5 text-sm text-violet-700 font-medium">
                            <Calendar size={13} />
                            {r.fecha_reunion}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-violet-700 font-medium">
                            <Clock size={13} />
                            {r.hora_reunion}
                          </div>
                        </div>
                        {r.mensaje && (
                          <p className="text-sm text-slate-600 mt-3">{r.mensaje}</p>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center">
                            <MessageSquare size={13} className="text-brand-600" />
                          </div>
                          <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-100">
                            Mensaje del tutor
                          </span>
                          {r.fecha_respuesta && (
                            <span className="text-xs text-slate-400 ml-auto">{r.fecha_respuesta}</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{r.mensaje}</p>
                      </>
                    )}
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