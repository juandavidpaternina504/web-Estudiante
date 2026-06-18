import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Send, FileText, ArrowRight, Lightbulb, User } from 'lucide-react'
import { crearSolicitud, getTutores } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import PageHeader from '../components/PageHeader'
import Alert from '../components/Alert'
import Spinner from '../components/Spinner'

const suggestions = [
  '¿Qué es FastAPI y cómo se diferencia de Flask?',
  '¿Cómo funciona el modelo cliente-servidor?',
  '¿Puedes explicarme los conceptos de herencia en POO?',
  '¿Qué son las bases de datos relacionales?',
]

export default function NuevaSolicitud() {
  const { getEstudiante } = useAuth()
  const { id: estudianteId } = getEstudiante()

  const [pregunta, setPregunta]   = useState('')
  const [tutorId, setTutorId]     = useState('')
  const [tutores, setTutores]     = useState([])
  const [loadingTutores, setLoadingTutores] = useState(true)
  const [loading, setLoading]     = useState(false)
  const [success, setSuccess]     = useState(false)
  const [error, setError]         = useState('')

  const charLimit = 500

  useEffect(() => {
    getTutores()
      .then(({ data }) => setTutores(data || []))
      .catch(() => setError('No se pudieron cargar los tutores.'))
      .finally(() => setLoadingTutores(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!pregunta.trim()) { setError('Escribe tu pregunta antes de enviar.'); return }
    if (pregunta.trim().length < 10) { setError('La pregunta es muy corta. Sé más específico.'); return }
    if (!tutorId) { setError('Selecciona un tutor.'); return }

    setLoading(true)
    setError('')
    try {
      await crearSolicitud(pregunta.trim(), Number(estudianteId), Number(tutorId))
      setSuccess(true)
      setPregunta('')
      setTutorId('')
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo enviar la solicitud. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => { setSuccess(false); setError(''); setPregunta(''); setTutorId('') }

  if (success) {
    return (
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <div className="card p-10 text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <span className="text-3xl">✅</span>
          </div>
          <h2 className="text-lg font-semibold text-slate-800 mb-2">¡Solicitud enviada!</h2>
          <p className="text-sm text-slate-500 mb-7">Tu pregunta fue enviada al tutor. Recibirás una respuesta pronto.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={handleReset} className="btn-secondary">Nueva solicitud</button>
            <Link to="/mis-solicitudes" className="btn-primary">
              Ver mis solicitudes <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <PageHeader
        title="Nueva Solicitud"
        description="Selecciona un tutor y escribe tu pregunta."
      />

      <div className="grid gap-5">
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <FileText size={15} className="text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-800">Tu solicitud</h2>
          </div>

          {error && (
            <div className="mb-4">
              <Alert type="error" message={error} onClose={() => setError('')} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Selector de tutor */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Tutor asignado
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                {loadingTutores ? (
                  <div className="input-field pl-9 flex items-center gap-2 text-slate-400">
                    <Spinner size="sm" /> Cargando tutores...
                  </div>
                ) : (
                  <select
                    value={tutorId}
                    onChange={(e) => { setTutorId(e.target.value); setError('') }}
                    className="input-field pl-9 appearance-none cursor-pointer"
                  >
                    <option value="">— Selecciona un tutor —</option>
                    {tutores.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nombre} {t.especialidad ? `· ${t.especialidad}` : ''}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Textarea */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Tu pregunta
              </label>
              <textarea
                value={pregunta}
                onChange={(e) => {
                  if (e.target.value.length <= charLimit) setPregunta(e.target.value)
                  setError('')
                }}
                rows={6}
                placeholder="Ej: ¿Cómo implemento autenticación JWT en una API con FastAPI?"
                className="input-field resize-none leading-relaxed"
              />
              <div className="flex justify-end mt-1">
                <span className={`text-xs ${pregunta.length > charLimit * 0.9 ? 'text-amber-500' : 'text-slate-400'}`}>
                  {pregunta.length}/{charLimit}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !pregunta.trim() || !tutorId}
              className="btn-primary w-full justify-center"
            >
              {loading ? <><Spinner size="sm" /> Enviando...</> : <><Send size={14} /> Enviar solicitud</>}
            </button>
          </form>
        </div>

        {/* Sugerencias */}
        
      </div>
    </div>
  )
}