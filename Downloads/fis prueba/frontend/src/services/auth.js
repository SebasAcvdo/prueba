import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token enviado:', token.substring(0, 20) + '...');
    } else {
      console.warn('No hay token en localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si es 401 o 403, redirigir al login (token expirado o inválido)
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Solo redirigir si no es la ruta de login
      if (!originalRequest.url.includes('/auth/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    
    // Reintentar en errores 500 (máximo 2 reintentos)
    if (
      error.response?.status >= 500 &&
      !originalRequest._retry &&
      originalRequest._retryCount < 2
    ) {
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      
      // Esperar 1 segundo antes de reintentar
      await new Promise(resolve => setTimeout(resolve, 1000));
      return api(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (correo, password) => {
    const response = await api.post('/auth/login', { correo, password });
    return response.data;
  },

  resetPassword: async (correo, nuevaPassword) => {
    const response = await api.put('/auth/reset-password', null, {
      params: { correo, nuevaPassword },
    });
    return response.data;
  },
};

export default api;
