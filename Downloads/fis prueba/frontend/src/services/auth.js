import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
