import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar datos del localStorage al iniciar
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (correo, password) => {
    const response = await authService.login(correo, password);
    const userData = {
      id: response.usuarioId,
      nombre: response.nombre,
      correo: response.correo,
      rol: response.rol,
      cambiarPass: response.cambiarPass || false,
    };
    setUser(userData);
    setToken(response.accessToken);
    localStorage.setItem('token', response.accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    return response;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const resetPassword = async (usuario, newPassword) => {
    const response = await authService.resetPassword(usuario, newPassword);
    const userData = {
      id: response.usuarioId,
      nombre: response.nombre,
      correo: response.correo,
      rol: response.rol,
    };
    setUser(userData);
    setToken(response.accessToken);
    localStorage.setItem('token', response.accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    return response;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    resetPassword,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export default AuthContext;
