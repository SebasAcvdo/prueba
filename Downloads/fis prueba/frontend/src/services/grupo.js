import api from './auth';

export const grupoService = {
  listar: async (token) => {
    const response = await api.get('/grupos', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  obtener: async (id, token) => {
    const response = await api.get(`/grupos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  crear: async (data, token) => {
    const response = await api.post('/grupos', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  confirmar: async (id, token) => {
    const response = await api.patch(
      `/grupos/${id}/confirmar`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  agregarEstudiante: async (grupoId, estudianteId, token) => {
    const response = await api.post(
      `/grupos/${grupoId}/estudiantes`,
      { estudianteId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  descargarListado: async (id, token) => {
    const response = await api.get(`/grupos/${id}/listado.pdf`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob',
    });
    return response.data;
  },
};
