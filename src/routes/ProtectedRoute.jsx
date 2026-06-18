import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem('estudiante_id')
  return isAuthenticated ? children : <Navigate to="/login" replace />
}
