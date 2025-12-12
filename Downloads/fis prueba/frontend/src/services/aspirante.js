import api from './auth';

export const aspiranteService = {
  listar: async (token) => {
    const response = await api.get('/aspirantes', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  crear: async (data, token) => {
    const response = await api.post('/aspirantes', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  cambiarEstado: async (id, estado, token) => {
    const response = await api.patch(
      `/aspirantes/${id}/estado?estado=${estado}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  agendarEntrevista: async (id, fecha, token) => {
    const response = await api.put(
      `/aspirantes/${id}/entrevista?fecha=${fecha}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
};
