import { useState } from 'react';
import { crearPreinscripcion } from '../services/aspirantePublicoService';

/**
 * Hook personalizado para manejar la lógica de preinscripción
 */
export const usePreinscripcion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resultado, setResultado] = useState(null); // {claveTemporal, aspiranteId, estudianteId}
  const [mostrarModal, setMostrarModal] = useState(false);

  /**
   * Enviar formulario de preinscripción
   */
  const enviarPreinscripcion = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await crearPreinscripcion(data);
      
      // Guardar en localStorage para consultas posteriores
      localStorage.setItem('claveTemporal', response.claveTemporal);
      localStorage.setItem('aspiranteId', response.aspiranteId.toString());
      localStorage.setItem('estudianteId', response.estudianteId.toString());
      
      // Actualizar estado
      setResultado(response);
      setMostrarModal(true);
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cerrar modal y limpiar resultado
   */
  const cerrarModal = () => {
    setMostrarModal(false);
  };

  /**
   * Reset completo del hook
   */
  const reset = () => {
    setLoading(false);
    setError(null);
    setResultado(null);
    setMostrarModal(false);
  };

  return {
    loading,
    error,
    resultado,
    mostrarModal,
    enviarPreinscripcion,
    cerrarModal,
    reset
  };
};
