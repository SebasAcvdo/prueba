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
import { AdminAspirantes } from './pages/AdminAspirantes';
import { AdminCitaciones } from './pages/AdminCitaciones';
import { AcudienteBoletin } from './pages/AcudienteBoletin';
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

            {/* Rutas Admin */}
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

            {/* Rutas Acudiente */}
            <Route
              path="/acudiente/boletin"
              element={
                <ProtectedRoute allowedRoles={['ACUDIENTE']}>
                  <AcudienteBoletin />
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
