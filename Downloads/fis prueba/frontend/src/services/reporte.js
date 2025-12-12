import api from './auth';

export const reporteService = {
  descargarBoletin: async (estudianteId, periodo, token) => {
    const response = await api.get(
      `/calificaciones/reporte/boletin.pdf?estudianteId=${estudianteId}&periodo=${periodo}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      }
    );
    return response.data;
  },
};
