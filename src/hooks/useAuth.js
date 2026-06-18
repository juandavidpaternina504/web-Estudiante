import { useNavigate } from 'react-router-dom'

export function useAuth() {
  const navigate = useNavigate()

  const getEstudiante = () => ({
    id: localStorage.getItem('estudiante_id'),
    nombre: localStorage.getItem('nombre'),
  })

  const isAuthenticated = () => !!localStorage.getItem('estudiante_id')

  const logout = () => {
    localStorage.removeItem('estudiante_id')
    localStorage.removeItem('nombre')
    navigate('/login')
  }

  return { getEstudiante, isAuthenticated, logout }
}
