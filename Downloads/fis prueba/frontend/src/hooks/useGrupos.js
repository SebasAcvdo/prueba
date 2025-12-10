import { useState } from 'react';
import { grupoService } from '../services/grupo';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const useGrupos = () => {
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchGrupos = async () => {
    try {
      setLoading(true);
      const data = await grupoService.listar(token);
      setGrupos(data);
    } catch (error) {
      toast.error('Error al cargar grupos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const crearGrupo = async (data) => {
    try {
      setLoading(true);
      const nuevo = await grupoService.crear(data, token);
      toast.success('Grupo creado exitosamente');
      return nuevo;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear grupo');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const confirmarGrupo = async (id) => {
    try {
      await grupoService.confirmar(id, token);
      toast.success('Grupo confirmado exitosamente');
      fetchGrupos();
    } catch (error) {
      toast.error('Error al confirmar grupo');
      throw error;
    }
  };

  const descargarListado = async (id, nombreGrupo) => {
    try {
      const blob = await grupoService.descargarListado(id, token);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `listado_${nombreGrupo || id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('PDF descargado exitosamente');
    } catch (error) {
      toast.error('Error al descargar PDF');
      throw error;
    }
  };

  return {
    grupos,
    loading,
    fetchGrupos,
    crearGrupo,
    confirmarGrupo,
    descargarListado,
  };
};
