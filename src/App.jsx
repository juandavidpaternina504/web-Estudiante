import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Bienestar from './pages/Bienestar'
import NuevaSolicitud from './pages/NuevaSolicitud'
import MisSolicitudes from './pages/MisSolicitudes'
import Respuestas from './pages/Respuestas'
import DetalleSolicitud from './pages/DetalleSolicitud'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"          element={<Dashboard />} />
          <Route path="bienestar"          element={<Bienestar />} />
          <Route path="solicitudes/nueva"  element={<NuevaSolicitud />} />
          <Route path="mis-solicitudes"    element={<MisSolicitudes />} />
          <Route path="respuestas"         element={<Respuestas />} />
          <Route path="solicitudes/:id" element={<DetalleSolicitud />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
