import { useState } from 'react';
import { aspiranteService } from '../services/aspirante';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const useAspirantes = () => {
  const [aspirantes, setAspirantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchAspirantes = async () => {
    try {
      setLoading(true);
      const data = await aspiranteService.listar(token);
      setAspirantes(data);
    } catch (error) {
      toast.error('Error al cargar aspirantes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const crearAspirante = async (data) => {
    try {
      setLoading(true);
      const nuevo = await aspiranteService.crear(data, token);
      toast.success('Aspirante creado exitosamente');
      return nuevo;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear aspirante');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await aspiranteService.cambiarEstado(id, estado, token);
      toast.success('Estado actualizado exitosamente');
      fetchAspirantes();
    } catch (error) {
      toast.error('Error al cambiar estado');
      throw error;
    }
  };

  const agendarEntrevista = async (id, fecha) => {
    try {
      await aspiranteService.agendarEntrevista(id, fecha, token);
      toast.success('Entrevista agendada exitosamente');
      fetchAspirantes();
    } catch (error) {
      toast.error('Error al agendar entrevista');
      throw error;
    }
  };

  return {
    aspirantes,
    loading,
    fetchAspirantes,
    crearAspirante,
    cambiarEstado,
    agendarEntrevista,
  };
};
