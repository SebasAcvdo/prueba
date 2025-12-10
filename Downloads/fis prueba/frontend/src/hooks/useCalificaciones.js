import { useState } from 'react';
import { calificacionService } from '../services/calificacion';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const useCalificaciones = () => {
  const [calificaciones, setCalificaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchCalificaciones = async (estudianteId, periodo = null) => {
    try {
      setLoading(true);
      const data = await calificacionService.consultar(estudianteId, periodo, token);
      setCalificaciones(data);
    } catch (error) {
      toast.error('Error al cargar calificaciones');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const crearCalificacion = async (data) => {
    try {
      setLoading(true);
      const nueva = await calificacionService.crear(data, token);
      toast.success('Calificación registrada exitosamente');
      return nueva;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al registrar calificación');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const actualizarCalificacion = async (id, data) => {
    try {
      setLoading(true);
      const actualizada = await calificacionService.actualizar(id, data, token);
      toast.success('Calificación actualizada exitosamente');
      return actualizada;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al actualizar calificación');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    calificaciones,
    loading,
    fetchCalificaciones,
    crearCalificacion,
    actualizarCalificacion,
  };
};
