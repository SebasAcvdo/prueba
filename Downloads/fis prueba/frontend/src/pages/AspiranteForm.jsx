import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import api from '../services/auth';
import styles from './AspiranteForm.module.css';

export const AspiranteForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombreUsuario: '',
    correo: '',
    estudiantes: [
      {
        nombre: '',
        apellido: '',
        fechaNacimiento: '',
        grado: 'JARDIN'
      }
    ]
  });

  const handleAddEstudiante = () => {
    setFormData({
      ...formData,
      estudiantes: [
        ...formData.estudiantes,
        { nombre: '', apellido: '', fechaNacimiento: '', grado: 'JARDIN' }
      ]
    });
  };

  const handleRemoveEstudiante = (index) => {
    if (formData.estudiantes.length > 1) {
      setFormData({
        ...formData,
        estudiantes: formData.estudiantes.filter((_, i) => i !== index)
      });
    }
  };

  const handleEstudianteChange = (index, field, value) => {
    const newEstudiantes = [...formData.estudiantes];
    newEstudiantes[index] = {
      ...newEstudiantes[index],
      [field]: value
    };
    setFormData({ ...formData, estudiantes: newEstudiantes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/aspirantes', formData);
      alert('Pre-inscripción enviada correctamente. Revisa tu correo para las credenciales.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar la pre-inscripción');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.header}>
          <h1>Pre-Inscripción</h1>
          <p>Completa el formulario para pre-inscribir a tus hijos en Academia Veritas</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Datos del Acudiente */}
          <div className={styles.section}>
            <h2>Datos del Acudiente</h2>
            <div className={styles.formGroup}>
              <label htmlFor="nombreUsuario">Nombre completo *</label>
              <input
                type="text"
                id="nombreUsuario"
                value={formData.nombreUsuario}
                onChange={(e) => setFormData({ ...formData, nombreUsuario: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="correo">Correo electrónico *</label>
              <input
                type="email"
                id="correo"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Datos de los Estudiantes */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Datos de los Estudiantes</h2>
              <Button type="button" onClick={handleAddEstudiante} size="small">
                + Agregar Estudiante
              </Button>
            </div>

            {formData.estudiantes.map((estudiante, index) => (
              <div key={index} className={styles.estudianteCard}>
                <div className={styles.estudianteHeader}>
                  <h3>Estudiante {index + 1}</h3>
                  {formData.estudiantes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveEstudiante(index)}
                      className={styles.removeBtn}
                    >
                      × Eliminar
                    </button>
                  )}
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Nombre *</label>
                    <input
                      type="text"
                      value={estudiante.nombre}
                      onChange={(e) => handleEstudianteChange(index, 'nombre', e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Apellido *</label>
                    <input
                      type="text"
                      value={estudiante.apellido}
                      onChange={(e) => handleEstudianteChange(index, 'apellido', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Fecha de Nacimiento *</label>
                    <input
                      type="date"
                      value={estudiante.fechaNacimiento}
                      onChange={(e) => handleEstudianteChange(index, 'fechaNacimiento', e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Grado *</label>
                    <select
                      value={estudiante.grado}
                      onChange={(e) => handleEstudianteChange(index, 'grado', e.target.value)}
                      required
                    >
                      <option value="JARDIN">Jardín</option>
                      <option value="TRANSICION">Transición</option>
                      <option value="PRIMERO">Primero</option>
                      <option value="SEGUNDO">Segundo</option>
                      <option value="TERCERO">Tercero</option>
                      <option value="CUARTO">Cuarto</option>
                      <option value="QUINTO">Quinto</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.actions}>
            <Button type="button" variant="secondary" onClick={() => navigate('/login')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Pre-Inscripción'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
