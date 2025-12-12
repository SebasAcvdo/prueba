import React, { useState, useEffect } from 'react';
import { Layout } from '../components/common/Layout';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import api from '../services/auth';
import styles from './AdminUsuarios.module.css';

export const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    rol: 'ACUDIENTE'
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchUsuarios();
  }, [currentPage]);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/usuarios/page', {
        params: { page: currentPage, size: 20 }
      });
      setUsuarios(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({ nombre: '', correo: '', rol: 'ACUDIENTE' });
    setShowModal(true);
  };

  const handleEdit = (usuario) => {
    setEditingUser(usuario);
    setFormData({
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingUser) {
        // Actualizar usuario
        await api.put(`/usuarios/${editingUser.id}`, formData);
        setSuccess('Usuario actualizado correctamente');
      } else {
        // Crear usuario
        const response = await api.post('/usuarios', formData);
        setSuccess(`Usuario creado. Contraseña temporal: ${response.data.passwordTemporal}`);
      }
      setShowModal(false);
      fetchUsuarios();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar usuario');
    }
  };

  const handleToggleEstado = async (id, estadoActual) => {
    try {
      setError('');
      setSuccess('');
      console.log('Cambiando estado del usuario', id, 'a', !estadoActual);
      console.log('Token en localStorage:', localStorage.getItem('token')?.substring(0, 20) + '...');
      
      const response = await api.patch(`/usuarios/${id}/estado?estado=${!estadoActual}`);
      console.log('Respuesta:', response);
      
      setSuccess('Estado actualizado correctamente');
      fetchUsuarios();
    } catch (err) {
      console.error('Error completo:', err);
      console.error('Status:', err.response?.status);
      console.error('Data:', err.response?.data);
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('No tienes permisos para realizar esta acción. Verifica que tu sesión no haya expirado.');
      } else {
        setError(err.response?.data?.message || 'Error al cambiar estado');
      }
    }
  };

  if (loading && usuarios.length === 0) {
    return (
      <Layout>
        <div className={styles.loadingContainer}>
          <Spinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Gestión de Usuarios</h1>
          <Button onClick={handleCreate}>Crear Usuario</Button>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(usuario => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.correo}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[usuario.rol.toLowerCase()]}`}>
                      {usuario.rol}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`${styles.toggleBtn} ${usuario.estado ? styles.active : styles.inactive}`}
                      onClick={() => handleToggleEstado(usuario.id, usuario.estado)}
                    >
                      {usuario.estado ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td>
                    <Button variant="secondary" size="small" onClick={() => handleEdit(usuario)}>
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className={styles.pagination}>
          <Button 
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            Anterior
          </Button>
          <span>Página {currentPage + 1} de {totalPages}</span>
          <Button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage >= totalPages - 1}
          >
            Siguiente
          </Button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2>{editingUser ? 'Editar Usuario' : 'Crear Usuario'}</h2>
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="nombre">Nombre completo</label>
                  <input
                    type="text"
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="correo">Correo electrónico</label>
                  <input
                    type="email"
                    id="correo"
                    value={formData.correo}
                    onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                    required
                    disabled={!!editingUser}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="rol">Rol</label>
                  <select
                    id="rol"
                    value={formData.rol}
                    onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                    required
                  >
                    <option value="ADMIN">Administrador</option>
                    <option value="PROFESOR">Profesor</option>
                    <option value="ACUDIENTE">Acudiente</option>
                    <option value="ASPIRANTE">Aspirante</option>
                  </select>
                </div>
                <div className={styles.modalActions}>
                  <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingUser ? 'Actualizar' : 'Crear'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
