import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor — attach student ID if available
api.interceptors.request.use((config) => {
  return config
})

// Response interceptor — global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('estudiante_id')
      localStorage.removeItem('nombre')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ── Auth ──────────────────────────────────────────────────
export const loginEstudiante = (correo, cedula) =>
  api.post('/login-estudiante', { correo, cedula })

// ── Solicitudes ───────────────────────────────────────────
export const getSolicitudes = () =>
  api.get('/solicitudes')

export const crearSolicitud = (pregunta, estudiante_id, tutor_id) =>
  api.post('/solicitudes', { estudiante_id, tutor_id, pregunta })

// ── Respuestas ────────────────────────────────────────────
export const getRespuestas = () =>
  api.get('/respuestas')

export default api

export const getBienestarEstudiante = (estudiante_id) =>
  api.get(`/bienestar/${estudiante_id}`)

export const getTutores = () =>
  api.get('/tutores')

export const getMisRespuestas = (estudiante_id) =>
  api.get(`/mis-respuestas/${estudiante_id}`)
