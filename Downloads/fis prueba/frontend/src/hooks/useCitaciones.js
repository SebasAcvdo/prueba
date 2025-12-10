import { useState } from 'react';
import { citacionService } from '../services/citacion';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const useCitaciones = () => {
  const [citaciones, setCitaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchCitaciones = async (tipo) => {
    try {
      setLoading(true);
      const data = await citacionService.listar(tipo, token);
      setCitaciones(data);
    } catch (error) {
      toast.error('Error al cargar citaciones');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const crearCitacion = async (data) => {
    try {
      setLoading(true);
      const nueva = await citacionService.crear(data, token);
      toast.success('Citación creada exitosamente');
      return nueva;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear citación');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    citaciones,
    loading,
    fetchCitaciones,
    crearCitacion,
  };
};
