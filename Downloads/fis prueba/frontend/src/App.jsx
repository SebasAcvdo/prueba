import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import { Login } from './pages/Login';
import { FirstLogin } from './pages/FirstLogin';
import { Dashboard } from './pages/Dashboard';
import { NotFound } from './components/common/NotFound';
import { ProfesorCalificaciones } from './pages/ProfesorCalificaciones';
import { ProfesorGrupos } from './pages/ProfesorGrupos';
import { ProfesorCitaciones } from './pages/ProfesorCitaciones';
import { ProfesorListadoEstudiantes } from './pages/ProfesorListadoEstudiantes';
import { ProfesorObservador } from './pages/ProfesorObservador';
import { AdminAspirantes } from './pages/AdminAspirantes';
import { AdminCitaciones } from './pages/AdminCitaciones';
import { AdminGrupos } from './pages/AdminGrupos';
import { AdminEstudiantes } from './pages/AdminEstudiantes';
import { AdminUsuarios } from './pages/AdminUsuarios';
import { AcudienteBoletin } from './pages/AcudienteBoletin';
import { AcudienteCitaciones } from './pages/AcudienteCitaciones';
import { AcudienteObservador } from './pages/AcudienteObservador';
import { AspiranteForm } from './pages/AspiranteForm';
import { AspiranteEstado } from './pages/AspiranteEstado';
import './styles/index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#0F1A30',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              },
            }}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/first-login" element={<FirstLogin />} />
            <Route path="/pre-inscripcion" element={<AspiranteForm />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Rutas Profesor */}
            <Route
              path="/profesor/calificaciones"
              element={
                <ProtectedRoute allowedRoles={['PROFESOR']}>
                  <ProfesorCalificaciones />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profesor/grupos"
              element={
                <ProtectedRoute allowedRoles={['PROFESOR']}>
                  <ProfesorGrupos />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profesor/citaciones"
              element={
                <ProtectedRoute allowedRoles={['PROFESOR']}>
                  <ProfesorCitaciones />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profesor/listado-estudiantes"
              element={
                <ProtectedRoute allowedRoles={['PROFESOR']}>
                  <ProfesorListadoEstudiantes />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profesor/observador"
              element={
                <ProtectedRoute allowedRoles={['PROFESOR']}>
                  <ProfesorObservador />
                </ProtectedRoute>
              }
            />

            {/* Rutas Admin */}
            <Route
              path="/admin/usuarios"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminUsuarios />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/aspirantes"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminAspirantes />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/citaciones"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminCitaciones />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/grupos"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminGrupos />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/estudiantes"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminEstudiantes />
                </ProtectedRoute>
              }
            />

            {/* Rutas Acudiente */}
            <Route
              path="/acudiente/boletin"
              element={
                <ProtectedRoute allowedRoles={['ACUDIENTE']}>
                  <AcudienteBoletin />
                </ProtectedRoute>
              }
            />

            <Route
              path="/acudiente/citaciones"
              element={
                <ProtectedRoute allowedRoles={['ACUDIENTE']}>
                  <AcudienteCitaciones />
                </ProtectedRoute>
              }
            />

            <Route
              path="/acudiente/observador"
              element={
                <ProtectedRoute allowedRoles={['ACUDIENTE']}>
                  <AcudienteObservador />
                </ProtectedRoute>
              }
            />

            {/* Rutas Aspirante */}
            <Route
              path="/aspirante/estado"
              element={
                <ProtectedRoute allowedRoles={['ASPIRANTE']}>
                  <AspiranteEstado />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
