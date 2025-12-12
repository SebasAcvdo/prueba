import { useState } from 'react';
import { solicitarClaveTemporal } from '../services/aspiranteService';

/**
 * Hook para gestionar el registro de aspirantes
 * Maneja el estado del proceso de solicitud de clave temporal
 */
export const useAspiranteRegistro = () => {
  const [registroStatus, setRegistroStatus] = useState('idle'); // 'idle' | 'sending' | 'ok' | 'error'
  const [claveTemporal, setClaveTemporal] = useState(null);
  const [aspiranteId, setAspiranteId] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Solicita una clave temporal para el correo proporcionado
   * @param {string} correo - Email del aspirante
   */
  const solicitarClave = async (correo) => {
    setRegistroStatus('sending');
    setError(null);

    try {
      const response = await solicitarClaveTemporal(correo);
      setClaveTemporal(response.claveTemporal);
      setAspiranteId(response.aspiranteId);
      setRegistroStatus('ok');
      return response;
    } catch (err) {
      const mensajeError = err.response?.data?.message || 
        (err.response?.status === 404 
          ? 'Endpoint no implementado. El backend necesita el endpoint POST /api/aspirantes/solicitar-clave'
          : 'Error al solicitar clave temporal. Verifica que el backend esté ejecutándose.');
      setError(mensajeError);
      setRegistroStatus('error');
      throw err;
    }
  };

  /**
   * Resetea el estado del hook
   */
  const resetear = () => {
    setRegistroStatus('idle');
    setClaveTemporal(null);
    setAspiranteId(null);
    setError(null);
  };

  return {
    registroStatus,
    claveTemporal,
    aspiranteId,
    error,
    solicitarClave,
    resetear,
  };
};
