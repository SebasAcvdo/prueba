import api from './auth';

export const calificacionService = {
  consultar: async (estudianteId, periodo, token) => {
    let url = `/calificaciones?estudianteId=${estudianteId}`;
    if (periodo) {
      url += `&periodo=${periodo}`;
    }
    const response = await api.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  crear: async (data, token) => {
    const response = await api.post('/calificaciones', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  actualizar: async (id, data, token) => {
    const response = await api.put(`/calificaciones/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
