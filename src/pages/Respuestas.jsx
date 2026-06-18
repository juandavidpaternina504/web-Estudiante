import { useState, useEffect } from 'react'
import { MessageSquare, Calendar, Clock, RefreshCw, Video } from 'lucide-react'
import { getSolicitudes, getRespuestas } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import Spinner from '../components/Spinner'
import Alert from '../components/Alert'

function RespuestaCard({ respuesta, solicitud }) {
  const isReunion =
    respuesta.tipo === 'REUNION' ||
    respuesta.fecha_reunion ||
    respuesta.hora_reunion

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isReunion ? 'bg-violet-50' : 'bg-brand-50'
        }`}>
          {isReunion
            ? <Video size={16} className="text-violet-600" />
            : <MessageSquare size={16} className="text-brand-600" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isReunion
                ? 'bg-violet-100 text-violet-700'
                : 'bg-brand-100 text-brand-700'
            }`}>
              {isReunion ? '📅 Reunión' : '💬 Mensaje'}
            </span>
            {respuesta.fecha_respuesta && (
              <span className="text-xs text-slate-400">
                {new Date(respuesta.fecha_respuesta).toLocaleDateString('es-CO', {
                  day: '2-digit', month: 'short', year: 'numeric'
                })}
              </span>
            )}
          </div>
          {solicitud && (
            <p className="text-xs text-slate-500 mt-1 truncate">
              Re: {solicitud.pregunta}
            </p>
          )}
        </div>
      </div>

      {/* Reunion details */}
      {isReunion && (respuesta.fecha_reunion || respuesta.hora_reunion) && (
        <div className="flex flex-wrap gap-3 mb-3 p-3 bg-violet-50 rounded-lg border border-violet-100">
          {respuesta.fecha_reunion && (
            <div className="flex items-center gap-1.5 text-sm text-violet-700">
              <Calendar size={13} />
              <span className="font-medium">
                {new Date(respuesta.fecha_reunion + 'T00:00:00').toLocaleDateString('es-CO', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                })}
              </span>
            </div>
          )}
          {respuesta.hora_reunion && (
            <div className="flex items-center gap-1.5 text-sm text-violet-700">
              <Clock size={13} />
              <span className="font-medium">{respuesta.hora_reunion}</span>
            </div>
          )}
        </div>
      )}

      {/* Message */}
      {respuesta.mensaje && (
        <p className="text-sm text-slate-700 leading-relaxed">{respuesta.mensaje}</p>
      )}

      {/* Tutor */}
      {respuesta.tutor_nombre && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
            <span className="text-[10px] font-bold text-slate-600">
              {respuesta.tutor_nombre[0]?.toUpperCase()}
            </span>
          </div>
          <span className="text-xs text-slate-500">
            Tutor: <span className="font-medium text-slate-700">{respuesta.tutor_nombre}</span>
          </span>
        </div>
      )}
    </div>
  )
}

export default function Respuestas() {
  const { getEstudiante } = useAuth()
  const { id: estudianteId } = getEstudiante()

  const [respuestas,  setRespuestas]  = useState([])
  const [solicitudes, setSolicitudes] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  const load = () => {
    setLoading(true)
    setError('')

    Promise.all([getSolicitudes(), getRespuestas()])
      .then(([solRes, respRes]) => {
        const misSolicitudes = (solRes.data || []).filter(
          s => String(s.estudiante_id) === String(estudianteId)
        )
        const misSolicitudIds = new Set(misSolicitudes.map(s => s.id))

        const misRespuestas = (respRes.data || []).filter(
          r => misSolicitudIds.has(r.solicitud_id)
        )
        misRespuestas.sort(
          (a, b) => new Date(b.fecha_respuesta) - new Date(a.fecha_respuesta)
        )

        setSolicitudes(misSolicitudes)
        setRespuestas(misRespuestas)
      })
      .catch(() => setError('No se pudieron cargar las respuestas.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [estudianteId])

  const getSolicitud = (solicitud_id) =>
    solicitudes.find(s => s.id === solicitud_id)

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <PageHeader
        title="Respuestas"
        description="Mensajes y reuniones enviados por tus tutores."
        action={
          <button onClick={load} className="btn-secondary" title="Actualizar">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Actualizar
          </button>
        }
      />

      {error && (
        <div className="mb-5">
          <Alert type="error" message={error} onClose={() => setError('')} />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : respuestas.length === 0 ? (
        <div className="card">
          <EmptyState
            title="Sin respuestas aún"
            description="Cuando un tutor responda tus solicitudes, aparecerán aquí."
          />
        </div>
      ) : (
        <div className="grid gap-4">
          {respuestas.map((r) => (
            <RespuestaCard
              key={r.id}
              respuesta={r}
              solicitud={getSolicitud(r.solicitud_id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
