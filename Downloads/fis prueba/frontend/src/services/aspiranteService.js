import api from './auth';

/**
 * Servicio para gestionar operaciones de aspirantes
 */

/**
 * Solicitar clave temporal para aspirante
 * POST /api/aspirantes/solicitar-clave
 * @param {string} correo - Email del aspirante
 * @returns {Promise<{claveTemporal: string, aspiranteId: number}>}
 */
export const solicitarClaveTemporal = async (correo) => {
  const response = await api.post('/aspirantes/solicitar-clave', { correo });
  return response.data;
};

/**
 * Enviar formulario de pre-inscripción
 * POST /api/aspirantes/{id}/formulario
 * @param {number} aspiranteId - ID del aspirante
 * @param {Object} datos - Datos del formulario
 * @returns {Promise<{estado: string}>}
 */
export const enviarFormularioPreinscripcion = async (aspiranteId, datos) => {
  const response = await api.post(`/aspirantes/${aspiranteId}/formulario`, datos);
  return response.data;
};

/**
 * Obtener estado de pre-inscripción del aspirante
 * GET /api/aspirantes/{id}/estado
 * @param {number} aspiranteId - ID del aspirante
 * @returns {Promise<{estado: string, fechaEntrevista?: string}>}
 */
export const obtenerEstadoPreinscripcion = async (aspiranteId) => {
  const response = await api.get(`/aspirantes/${aspiranteId}/estado`);
  return response.data;
};

/**
 * Obtener datos del aspirante autenticado
 * GET /api/aspirantes/me
 * @returns {Promise<Object>} Datos del aspirante
 */
export const obtenerDatosAspirante = async () => {
  const response = await api.get('/aspirantes/me');
  return response.data;
};
