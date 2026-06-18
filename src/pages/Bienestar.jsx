import { useState, useEffect } from 'react'
import { Brain, BookOpen, HeartHandshake, Users, Phone, Mail, MapPin, Clock, MessageSquare, Video, Calendar } from 'lucide-react'
import { getBienestarEstudiante } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'
import Alert from '../components/Alert'

const contacts = [
  { icon: Phone, label: 'Teléfono',   value: '(+57) 094 278 3030' },
  { icon: Mail,  label: 'Correo',     value: 'bienestar@cecar.edu.co' },
  { icon: MapPin,label: 'Ubicación',  value: 'Bloque A — Piso 2, Campus CECAR' },
  { icon: Clock, label: 'Horario',    value: 'Lunes a viernes, 7:00 a.m. – 5:00 p.m.' },
]

export default function Bienestar() {
  const { getEstudiante } = useAuth()
  const { id: estudianteId } = getEstudiante()

  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')

  useEffect(() => {
    getBienestarEstudiante(estudianteId)
      .then(({ data }) => setData(data))
      .catch(() => setError('No se pudo cargar la información de bienestar.'))
      .finally(() => setLoading(false))
  }, [estudianteId])

  if (loading) return (
    <div className="flex justify-center py-24"><Spinner size="lg" /></div>
  )

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <PageHeader
        title="Bienestar Universitario"
        description="Tu resumen académico y servicios de apoyo disponibles."
      />

      {error && <div className="mb-5"><Alert type="error" message={error} /></div>}

      {data && (
        <>
          {/* Perfil del estudiante */}
          <div className="card p-5 mb-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-brand-700">
                  {data.nombre?.[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{data.nombre}</p>
                <p className="text-xs text-slate-500">{data.correo}</p>
                <p className="text-xs text-brand-600 font-medium mt-0.5">{data.programa}</p>
              </div>
              <div className="ml-auto flex gap-4 text-center">
                <div>
                  <p className="text-xl font-bold text-slate-900">{data.total_solicitudes}</p>
                  <p className="text-xs text-slate-400">Solicitudes</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-emerald-600">{data.total_respondidas}</p>
                  <p className="text-xs text-slate-400">Respondidas</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-amber-500">{data.total_pendientes}</p>
                  <p className="text-xs text-slate-400">Pendientes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Historial */}
          {data.historial?.length > 0 && (
            <div className="card mb-5">
              <div className="px-5 py-4 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-800">Historial de tutorías</p>
              </div>
              <div className="divide-y divide-slate-100">
                {data.historial.map((item, i) => (
                  <div key={i} className="px-5 py-4">
                    <p className="text-xs text-slate-400 mb-1">Re: <span className="text-slate-600">{item.pregunta}</span></p>
                    {item.tipo === 'REUNION' ? (
                      <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-lg border border-violet-100">
                        <Video size={14} className="text-violet-600 flex-shrink-0" />
                        <div className="flex gap-4 text-sm text-violet-700">
                          <span className="flex items-center gap-1"><Calendar size={12} />{item.fecha_reunion}</span>
                          <span className="flex items-center gap-1"><Clock size={12} />{item.hora_reunion}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <MessageSquare size={13} className="text-brand-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-700">{item.mensaje}</p>
                      </div>
                    )}
                    <p className="text-xs text-slate-400 mt-1.5">{item.fecha_respuesta}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Servicios estáticos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {[
          { icon: Brain,         color: 'purple',  title: 'Apoyo Psicológico',     desc: 'Orientación para el manejo del estrés y bienestar emocional.' },
          { icon: BookOpen,      color: 'blue',    title: 'Orientación Académica',  desc: 'Fortalece tus hábitos de estudio y supera dificultades académicas.' },
          { icon: HeartHandshake,color: 'emerald', title: 'Bienestar Estudiantil',  desc: 'Programas culturales, deportivos y de desarrollo personal.' },
          { icon: Users,         color: 'amber',   title: 'Red de Apoyo',           desc: 'Conecta con mentores, egresados y semilleros de investigación.' },
        ].map(({ icon: Icon, color, title, desc }) => {
          const bg = { purple:'bg-purple-50', blue:'bg-blue-50', emerald:'bg-emerald-50', amber:'bg-amber-50' }[color]
          const ic = { purple:'text-purple-600', blue:'text-blue-600', emerald:'text-emerald-600', amber:'text-amber-600' }[color]
          return (
            <div key={title} className="card p-4 flex gap-3">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={16} className={ic} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{title}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Contactos */}
      <div className="card p-5">
        <p className="text-sm font-semibold text-slate-800 mb-4">📍 Información de Contacto</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contacts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
                <Icon size={14} className="text-brand-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">{label}</p>
                <p className="text-sm text-slate-800">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}