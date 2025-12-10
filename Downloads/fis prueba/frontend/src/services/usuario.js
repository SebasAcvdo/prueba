import api from './auth';

export const usuarioService = {
  listar: async (page = 0, size = 20, token) => {
    const response = await api.get(`/usuarios/page?page=${page}&size=${size}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  crear: async (data, token) => {
    const response = await api.post('/usuarios', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  actualizar: async (id, data, token) => {
    const response = await api.put(`/usuarios/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  cambiarEstado: async (id, estado, token) => {
    const response = await api.patch(
      `/usuarios/${id}/estado?estado=${estado}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
};
