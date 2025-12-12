import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { obtenerDatosAspirante, obtenerEstadoPreinscripcion } from '../../services/aspiranteService';
import { obtenerEstadoPublico } from './services/aspirantePublicoService';
import { authService } from '../../services/auth';
import { Layout } from '../../components/common/Layout';
import FormPreinscripcion from './FormPreinscripcion';
import styles from './AspiranteDashboard.module.css';

/**
 * AspiranteDashboard - Panel principal del aspirante
 * Muestra:
 * - Bienvenida personalizada
 * - Estado de pre-inscripción con botón para completar
 * - Card con información según estado (Sin revisar, Espera entrevista, Aprobado)
 */
const AspiranteDashboard = () => {
  const { user } = useAuth();
  const [aspirante, setAspirante] = useState(null);
  const [estado, setEstado] = useState(null);
  const [estadoPublico, setEstadoPublico] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  // Estados para cambio de contraseña
  const [mostrarCambiarPass, setMostrarCambiarPass] = useState(false);
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [exitoPassword, setExitoPassword] = useState(false);
  const [cargandoPassword, setCargandoPassword] = useState(false);

  /**
   * Carga datos del aspirante autenticado
   * GET /api/aspirantes/me → {id, nombre, correo, estado, fechaEntrevista}
   */
  useEffect(() => {
    cargarDatosAspirante();
    
    // Verificar si tiene clave temporal (debe cambiar contraseña)
    if (user?.cambiarPass === true) {
      setMostrarCambiarPass(true);
    }
  }, [user]);

  const cargarDatosAspirante = async () => {
    setCargando(true);
    try {
      const datosAspirante = await obtenerDatosAspirante();
      console.log('Datos aspirante recibidos:', datosAspirante);
      setAspirante(datosAspirante);

      if (!datosAspirante.id) {
        console.error('IMPORTANTE: El aspirante no tiene ID. Cierra sesión y vuelve a iniciar sesión.');
        return;
      }

      // Obtiene estado público (con datos del estudiante) - ESTE ES EL PRINCIPAL
      try {
        const estadoPublicoData = await obtenerEstadoPublico(datosAspirante.id);
        setEstadoPublico(estadoPublicoData);
        
        // Mapear estado público al estado local para compatibilidad
        setEstado({
          estado: estadoPublicoData.estado,
          fechaEntrevista: estadoPublicoData.fechaEntrevista
        });
      } catch (error) {
        console.log('No se pudo cargar estado público:', error);
      }
    } catch (error) {
      console.error('Error al cargar datos del aspirante:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleCambiarPassword = async (e) => {
    e.preventDefault();
    setErrorPassword('');
    setExitoPassword(false);

    if (!nuevaPassword || !confirmarPassword) {
      setErrorPassword('Por favor completa ambos campos');
      return;
    }

    if (nuevaPassword.length < 6) {
      setErrorPassword('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      setErrorPassword('Las contraseñas no coinciden');
      return;
    }

    try {
      setCargandoPassword(true);
      await authService.resetPassword(user.correo, nuevaPassword);
      setExitoPassword(true);
      setNuevaPassword('');
      setConfirmarPassword('');
      
      // Actualizar el usuario en localStorage para quitar el flag cambiarPass
      const updatedUser = { ...user, cambiarPass: false };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setTimeout(() => {
        setMostrarCambiarPass(false);
        setExitoPassword(false);
      }, 2000);
    } catch (error) {
      setErrorPassword(error.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setCargandoPassword(false);
    }
  };

  /**
   * Callback cuando se completa el formulario
   * Actualiza el estado sin recargar la página
   */
  const handleFormularioCompletado = (nuevoEstado) => {
    setEstado(nuevoEstado);
    setMostrarFormulario(false);
  };

  /**
   * Obtiene icono según el estado
   */
  const getIconoEstado = () => {
    switch (estado?.estado) {
      case 'Sin revisar':
        return '📋';
      case 'Espera entrevista':
        return '📅';
      case 'Aprobado':
        return '✅';
      default:
        return '📝';
    }
  };

  /**
   * Obtiene color según el estado
   */
  const getColorEstado = () => {
    switch (estado?.estado) {
      case 'Sin revisar':
        return styles.estadoSinRevisar;
      case 'Espera entrevista':
        return styles.estadoEspera;
      case 'Aprobado':
        return styles.estadoAprobado;
      default:
        return styles.estadoIncompleto;
    }
  };

  if (cargando) {
    return (
      <Layout>
        <div className={styles.cargando}>
          <div className={styles.spinner}></div>
          <p>Cargando información...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        {/* Bienvenida */}
        <div className={styles.headerBienvenida}>
          <div className={styles.iconoBienvenida}>👋</div>
          <div>
            <h1 className={styles.titulo}>
              ¡Bienvenido, {aspirante?.nombre || user?.nombre || 'Aspirante'}!
            </h1>
            <p className={styles.subtitulo}>
              Aquí puedes gestionar tu proceso de pre-inscripción
            </p>
          </div>
        </div>

        {/* Grid de cards */}
        <div className={styles.grid}>
          {/* Card Estado Pre-inscripción */}
          <div className={`${styles.card} ${styles.cardDestacado}`}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitulo}>Estado de Pre-inscripción</h2>
              <span className={styles.iconoGrande}>{getIconoEstado()}</span>
            </div>

            <div className={styles.cardBody}>
              <div className={`${styles.badge} ${getColorEstado()}`}>
                {estado?.estado || 'Sin revisar'}
              </div>

              {(estado?.estado === 'Sin revisar' || !estado?.estado) && (
                <div className={styles.infoBox}>
                  <p className={styles.infoTexto}>
                    Tu solicitud ha sido recibida exitosamente.
                    Nuestro equipo la revisará pronto y te notificaremos sobre los próximos pasos.
                  </p>
                </div>
              )}

              {estado?.estado === 'Espera entrevista' && estado.fechaEntrevista && (
                <div className={styles.infoBoxExito}>
                  <p className={styles.infoTitulo}>
                    <strong>¡Felicitaciones!</strong>
                  </p>
                  <p className={styles.infoTexto}>
                    Has sido seleccionado para una entrevista.
                  </p>
                  <div className={styles.fechaEntrevista}>
                    <span className={styles.iconoCalendario}>📅</span>
                    <div>
                      <p className={styles.fechaLabel}>Fecha y hora:</p>
                      <p className={styles.fechaValor}>
                        {new Date(estado.fechaEntrevista).toLocaleString('es-CO', {
                          dateStyle: 'full',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {estado?.estado === 'Aprobado' && (
                <div className={styles.infoBoxExito}>
                  <p className={styles.infoTitulo}>
                    <strong>¡Proceso completado exitosamente!</strong>
                  </p>
                  <p className={styles.infoTexto}>
                    Has sido aprobado. En breve recibirás información sobre los siguientes pasos.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Card Información */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitulo}>Tu Información</h2>
              <span className={styles.iconoGrande}>👤</span>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Nombre:</span>
                <span className={styles.infoValor}>
                  {aspirante?.nombre || user?.nombre || 'No disponible'}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Correo:</span>
                <span className={styles.infoValor}>
                  {aspirante?.correo || user?.correo || 'No disponible'}
                </span>
              </div>
            </div>
          </div>

          {/* Card Seguridad */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitulo}>Seguridad</h2>
              <span className={styles.iconoGrande}>🔒</span>
            </div>
            <div className={styles.cardBody}>
              <p className={styles.infoTexto}>
                Cambia tu clave temporal por una contraseña segura
              </p>
              <button
                onClick={() => setMostrarCambiarPass(true)}
                className={styles.botonSecundario}
              >
                Cambiar Contraseña
              </button>
            </div>
          </div>

          {/* Card Datos del Estudiante */}
          {estadoPublico?.estudiante && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitulo}>Datos del Estudiante</h2>
                <span className={styles.iconoGrande}>👶</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Nombre:</span>
                  <span className={styles.infoValor}>
                    {estadoPublico.estudiante.nombre} {estadoPublico.estudiante.apellido}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Grado:</span>
                  <span className={styles.infoValor}>
                    {estadoPublico.estudiante.grado}
                  </span>
                </div>
                {estadoPublico.estudiante.fechaNacimiento && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Fecha de nacimiento:</span>
                    <span className={styles.infoValor}>
                      {new Date(estadoPublico.estudiante.fechaNacimiento).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Cambiar Contraseña */}
        {mostrarCambiarPass && (
          <div className={styles.modalOverlay} onClick={() => setMostrarCambiarPass(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Cambiar Contraseña</h2>
                <button
                  onClick={() => setMostrarCambiarPass(false)}
                  className={styles.modalCerrar}
                >
                  ✕
                </button>
              </div>

              {exitoPassword ? (
                <div className={styles.exitoMensaje}>
                  <span className={styles.exitoIcono}>✅</span>
                  <p>Contraseña cambiada exitosamente</p>
                </div>
              ) : (
                <form onSubmit={handleCambiarPassword} className={styles.modalForm}>
                  {errorPassword && (
                    <div className={styles.errorAlert}>{errorPassword}</div>
                  )}

                  <div className={styles.formGroup}>
                    <label htmlFor="nuevaPassword">Nueva Contraseña</label>
                    <input
                      id="nuevaPassword"
                      type="password"
                      value={nuevaPassword}
                      onChange={(e) => setNuevaPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className={styles.input}
                      disabled={cargandoPassword}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="confirmarPassword">Confirmar Contraseña</label>
                    <input
                      id="confirmarPassword"
                      type="password"
                      value={confirmarPassword}
                      onChange={(e) => setConfirmarPassword(e.target.value)}
                      placeholder="Repite la contraseña"
                      className={styles.input}
                      disabled={cargandoPassword}
                    />
                  </div>

                  <div className={styles.modalAcciones}>
                    <button
                      type="button"
                      onClick={() => setMostrarCambiarPass(false)}
                      className={styles.botonSecundario}
                      disabled={cargandoPassword}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className={styles.botonPrincipal}
                      disabled={cargandoPassword}
                    >
                      {cargandoPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Modal Formulario Pre-inscripción */}
        {mostrarFormulario && (
          <FormPreinscripcion
            aspiranteId={aspirante?.id}
            onCerrar={() => setMostrarFormulario(false)}
            onCompletado={handleFormularioCompletado}
          />
        )}
      </div>
    </Layout>
  );
};

export default AspiranteDashboard;
