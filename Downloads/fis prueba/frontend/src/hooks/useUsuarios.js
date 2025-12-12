import { useState } from 'react';
import { usuarioService } from '../services/usuario';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, size: 20, totalPages: 0 });
  const { token } = useAuth();

  const fetchUsuarios = async (page = 0, size = 20) => {
    try {
      setLoading(true);
      const data = await usuarioService.listar(page, size, token);
      setUsuarios(data.content || []);
      setPagination({
        page: data.number,
        size: data.size,
        totalPages: data.totalPages,
      });
    } catch (error) {
      toast.error('Error al cargar usuarios');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const crearUsuario = async (data) => {
    try {
      setLoading(true);
      const nuevo = await usuarioService.crear(data, token);
      toast.success('Usuario creado exitosamente');
      return nuevo;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear usuario');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const actualizarUsuario = async (id, data) => {
    try {
      setLoading(true);
      const actualizado = await usuarioService.actualizar(id, data, token);
      toast.success('Usuario actualizado exitosamente');
      return actualizado;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al actualizar usuario');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await usuarioService.cambiarEstado(id, estado, token);
      toast.success(`Usuario ${estado ? 'activado' : 'desactivado'} exitosamente`);
      fetchUsuarios(pagination.page, pagination.size);
    } catch (error) {
      toast.error('Error al cambiar estado del usuario');
      throw error;
    }
  };

  return {
    usuarios,
    loading,
    pagination,
    fetchUsuarios,
    crearUsuario,
    actualizarUsuario,
    cambiarEstado,
  };
};
