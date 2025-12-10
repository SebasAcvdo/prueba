import api from './auth';

export const citacionService = {
  listar: async (tipo, token) => {
    const response = await api.get(`/citaciones?tipo=${tipo}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  crear: async (data, token) => {
    const response = await api.post('/citaciones', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
