import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Mail, KeyRound, ArrowRight } from 'lucide-react'
import { loginEstudiante } from '../services/api'
import Alert from '../components/Alert'
import Spinner from '../components/Spinner'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ correo: '', cedula: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.correo || !form.cedula) {
      setError('Por favor, completa todos los campos.')
      return
    }
    setLoading(true)
    try {
      const { data } = await loginEstudiante(form.correo, form.cedula)
      localStorage.setItem('estudiante_id', data.id)
      localStorage.setItem('nombre', data.nombre)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'Credenciales incorrectas. Verifica tu correo y cédula.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-600 rounded-2xl mb-4 shadow-lg shadow-brand-600/20">
            <GraduationCap size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">TutorCECAR</h1>
          <p className="mt-1.5 text-sm text-slate-500">Sistema de Tutorías Universitarias</p>
        </div>

        {/* Card */}
        <div className="card p-7">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-slate-800">Acceso Estudiante</h2>
            <p className="text-sm text-slate-500 mt-0.5">Ingresa tus credenciales institucionales</p>
          </div>

          {error && (
            <div className="mb-5">
              <Alert type="error" message={error} onClose={() => setError('')} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Correo institucional
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="correo"
                  type="email"
                  placeholder="nombre@cecar.edu.co"
                  value={form.correo}
                  onChange={handleChange}
                  className="input-field pl-9"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Cédula
              </label>
              <div className="relative">
                <KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="cedula"
                  type="text"
                  placeholder="Número de cédula"
                  value={form.cedula}
                  onChange={handleChange}
                  className="input-field pl-9"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2"
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  Verificando...
                </>
              ) : (
                <>
                  Iniciar sesión
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          CECAR — Corporación Universitaria del Caribe
        </p>
      </div>
    </div>
  )
}
