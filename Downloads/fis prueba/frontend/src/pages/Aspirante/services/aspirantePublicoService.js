import axios from 'axios';

const API_URL = 'http://localhost:8090/api/aspirantes';

/**
 * Servicio público para aspirantes (sin autenticación JWT)
 */

/**
 * Crear preinscripción pública
 * Endpoint: POST /api/aspirantes/preinscripcion-publica
 * @param {Object} data - Datos del formulario de preinscripción
 * @returns {Promise<{claveTemporal: string, aspiranteId: number, estudianteId: number}>}
 */
export const crearPreinscripcion = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/preinscripcion-publica`, {
      correo: data.correo,
      nombreAcudiente: data.nombreAcudiente,
      apellidoAcudiente: data.apellidoAcudiente,
      telefono: data.telefono,
      nombreMenor: data.nombreMenor,
      apellidoMenor: data.apellidoMenor,
      grado: data.grado,
      fechaNacimiento: data.fechaNacimiento,
      alergias: data.alergias || ''
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al crear preinscripción:', error);
    throw new Error(
      error.response?.data?.message || 
      'Error al procesar la preinscripción. Por favor intenta nuevamente.'
    );
  }
};

/**
 * Obtener estado de inscripción pública (sin JWT)
 * Endpoint: GET /api/aspirantes/{id}/estado-publico
 * @param {number} aspiranteId - ID del aspirante
 * @returns {Promise<{estado: string, fechaEntrevista: string|null, estudiante: Object}>}
 */
export const obtenerEstadoPublico = async (aspiranteId) => {
  try {
    const response = await axios.get(`${API_URL}/${aspiranteId}/estado-publico`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener estado:', error);
    throw new Error(
      error.response?.data?.message || 
      'No se pudo cargar el estado de tu inscripción.'
    );
  }
};
