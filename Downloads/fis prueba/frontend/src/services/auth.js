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
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para reintentar en errores 500
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
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
