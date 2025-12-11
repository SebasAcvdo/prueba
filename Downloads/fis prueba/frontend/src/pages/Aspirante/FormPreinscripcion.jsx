import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { enviarFormularioPreinscripcion } from '../../services/aspiranteService';
import { toast } from 'react-hot-toast';
import styles from './FormPreinscripcion.module.css';

/**
 * Esquema de validación Zod - Paso 1: Datos del Acudiente
 */
const esquemaPaso1 = z.object({
  nombreAcudiente: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  apellidoAcudiente: z.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres'),
  telefonoAcudiente: z.string()
    .regex(/^3\d{9}$/, 'Debe ser un número de celular colombiano válido (10 dígitos, inicia con 3)'),
  correoAcudiente: z.string()
    .email('Correo electrónico inválido'),
});

/**
 * Esquema de validación Zod - Paso 2: Datos del Estudiante
 */
const esquemaPaso2 = z.object({
  nombreEstudiante: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  apellidoEstudiante: z.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres'),
  gradoAspirado: z.enum(['Párvulos', 'Caminadores', 'Pre-jardín'], {
    errorMap: () => ({ message: 'Selecciona un grado válido' }),
  }),
  fechaNacimiento: z.string()
    .refine((fecha) => {
      const fechaNac = new Date(fecha);
      const hoy = new Date();
      const edadMinima = new Date(hoy.getFullYear() - 3, hoy.getMonth(), hoy.getDate());
      return fechaNac <= edadMinima;
    }, 'El menor debe tener al menos 3 años'),
  registroCivil: z.string()
    .min(5, 'El número de registro civil es requerido')
    .max(20, 'Número de registro civil inválido'),
});

/**
 * Esquema de validación Zod - Paso 3: Información Médica
 */
const esquemaPaso3 = z.object({
  alergias: z.string()
    .max(500, 'Máximo 500 caracteres')
    .optional(),
  condicionesMedicas: z.string()
    .max(500, 'Máximo 500 caracteres')
    .optional(),
  medicamentos: z.string()
    .max(500, 'Máximo 500 caracteres')
    .optional(),
});



/**
 * FormPreinscripcion - Formulario multi-paso para pre-inscripción
 * 
 * @param {number} aspiranteId - ID del aspirante
 * @param {Function} onCerrar - Callback para cerrar modal
 * @param {Function} onCompletado - Callback cuando se completa exitosamente
 */
const FormPreinscripcion = ({ aspiranteId, onCerrar, onCompletado }) => {
  const [paso, setPaso] = useState(1);
  const [enviando, setEnviando] = useState(false);
  const [datosFormulario, setDatosFormulario] = useState({});

  // Selecciona el esquema según el paso actual
  const getEsquema = () => {
    switch (paso) {
      case 1:
        return esquemaPaso1;
      case 2:
        return esquemaPaso2;
      case 3:
        return esquemaPaso3;
      default:
        return esquemaPaso1;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(getEsquema()),
    mode: 'onChange',
  });

  /**
   * Maneja avance al siguiente paso
   * Guarda los datos del paso actual
   */
  const onSiguiente = (data) => {
    setDatosFormulario({ ...datosFormulario, ...data });
    setPaso(paso + 1);
    reset(); // Limpia el formulario para el siguiente paso
  };

  /**
   * Maneja retroceso al paso anterior
   */
  const onAnterior = () => {
    setPaso(paso - 1);
    reset();
  };

  /**
   * Envía el formulario completo al backend
   * POST /api/aspirantes/{id}/formulario → {estado: "Sin revisar"}
   */
  const onEnviar = async (data) => {
    const datosCompletos = { ...datosFormulario, ...data };

    setEnviando(true);
    try {
      // Estructura los datos para el backend
      const payload = {
        acudiente: {
          nombre: datosCompletos.nombreAcudiente,
          apellido: datosCompletos.apellidoAcudiente,
          telefono: datosCompletos.telefonoAcudiente,
          correo: datosCompletos.correoAcudiente,
        },
        estudiante: {
          nombre: datosCompletos.nombreEstudiante,
          apellido: datosCompletos.apellidoEstudiante,
          gradoAspirado: datosCompletos.gradoAspirado,
          fechaNacimiento: datosCompletos.fechaNacimiento,
          registroCivil: datosCompletos.registroCivil,
        },
        medico: {
          alergias: datosCompletos.alergias || 'Ninguna',
          condicionesMedicas: datosCompletos.condicionesMedicas || 'Ninguna',
          medicamentos: datosCompletos.medicamentos || 'Ninguno',
        },
      };

      const response = await enviarFormularioPreinscripcion(aspiranteId, payload);
      
      toast.success('¡Formulario enviado exitosamente!');
      
      // Notifica al dashboard con el nuevo estado
      onCompletado(response);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      toast.error(
        error.response?.data?.message || 
        'Error al enviar el formulario. Por favor intenta nuevamente.'
      );
    } finally {
      setEnviando(false);
    }
  };

  /**
   * Renderiza el contenido según el paso actual
   */
  const renderPaso = () => {
    switch (paso) {
      case 1:
        return (
          <div className={styles.pasoContenido}>
            <h3 className={styles.pasoTitulo}>Paso 1: Datos del Acudiente</h3>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="nombreAcudiente" className={styles.label}>
                  Nombre del Acudiente *
                </label>
                <input
                  id="nombreAcudiente"
                  type="text"
                  {...register('nombreAcudiente')}
                  className={`${styles.input} ${errors.nombreAcudiente ? styles.inputError : ''}`}
                  placeholder="Juan"
                />
                {errors.nombreAcudiente && (
                  <span className={styles.errorText}>{errors.nombreAcudiente.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="apellidoAcudiente" className={styles.label}>
                  Apellido del Acudiente *
                </label>
                <input
                  id="apellidoAcudiente"
                  type="text"
                  {...register('apellidoAcudiente')}
                  className={`${styles.input} ${errors.apellidoAcudiente ? styles.inputError : ''}`}
                  placeholder="Pérez"
                />
                {errors.apellidoAcudiente && (
                  <span className={styles.errorText}>{errors.apellidoAcudiente.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="telefonoAcudiente" className={styles.label}>
                  Teléfono (Celular) *
                </label>
                <input
                  id="telefonoAcudiente"
                  type="tel"
                  {...register('telefonoAcudiente')}
                  className={`${styles.input} ${errors.telefonoAcudiente ? styles.inputError : ''}`}
                  placeholder="3001234567"
                  maxLength="10"
                />
                {errors.telefonoAcudiente && (
                  <span className={styles.errorText}>{errors.telefonoAcudiente.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="correoAcudiente" className={styles.label}>
                  Correo Electrónico *
                </label>
                <input
                  id="correoAcudiente"
                  type="email"
                  {...register('correoAcudiente')}
                  className={`${styles.input} ${errors.correoAcudiente ? styles.inputError : ''}`}
                  placeholder="correo@ejemplo.com"
                />
                {errors.correoAcudiente && (
                  <span className={styles.errorText}>{errors.correoAcudiente.message}</span>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className={styles.pasoContenido}>
            <h3 className={styles.pasoTitulo}>Paso 2: Datos del Estudiante</h3>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="nombreEstudiante" className={styles.label}>
                  Nombre del Estudiante *
                </label>
                <input
                  id="nombreEstudiante"
                  type="text"
                  {...register('nombreEstudiante')}
                  className={`${styles.input} ${errors.nombreEstudiante ? styles.inputError : ''}`}
                  placeholder="María"
                />
                {errors.nombreEstudiante && (
                  <span className={styles.errorText}>{errors.nombreEstudiante.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="apellidoEstudiante" className={styles.label}>
                  Apellido del Estudiante *
                </label>
                <input
                  id="apellidoEstudiante"
                  type="text"
                  {...register('apellidoEstudiante')}
                  className={`${styles.input} ${errors.apellidoEstudiante ? styles.inputError : ''}`}
                  placeholder="Pérez"
                />
                {errors.apellidoEstudiante && (
                  <span className={styles.errorText}>{errors.apellidoEstudiante.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="gradoAspirado" className={styles.label}>
                  Grado al que Aspira *
                </label>
                <select
                  id="gradoAspirado"
                  {...register('gradoAspirado')}
                  className={`${styles.input} ${errors.gradoAspirado ? styles.inputError : ''}`}
                >
                  <option value="">Selecciona un grado</option>
                  <option value="Párvulos">Párvulos</option>
                  <option value="Caminadores">Caminadores</option>
                  <option value="Pre-jardín">Pre-jardín</option>
                </select>
                {errors.gradoAspirado && (
                  <span className={styles.errorText}>{errors.gradoAspirado.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="fechaNacimiento" className={styles.label}>
                  Fecha de Nacimiento *
                </label>
                <input
                  id="fechaNacimiento"
                  type="date"
                  {...register('fechaNacimiento')}
                  className={`${styles.input} ${errors.fechaNacimiento ? styles.inputError : ''}`}
                  max={new Date().toISOString().split('T')[0]}
                />
                {errors.fechaNacimiento && (
                  <span className={styles.errorText}>{errors.fechaNacimiento.message}</span>
                )}
              </div>

              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="registroCivil" className={styles.label}>
                  Número de Registro Civil *
                </label>
                <input
                  id="registroCivil"
                  type="text"
                  {...register('registroCivil')}
                  className={`${styles.input} ${errors.registroCivil ? styles.inputError : ''}`}
                  placeholder="123456789"
                />
                {errors.registroCivil && (
                  <span className={styles.errorText}>{errors.registroCivil.message}</span>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className={styles.pasoContenido}>
            <h3 className={styles.pasoTitulo}>Paso 3: Información Médica</h3>
            <p className={styles.pasoDescripcion}>
              Esta información es importante para el cuidado del menor. Si no aplica, puedes dejar los campos vacíos.
            </p>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="alergias" className={styles.label}>
                  Alergias (Opcional)
                </label>
                <textarea
                  id="alergias"
                  {...register('alergias')}
                  className={`${styles.textarea} ${errors.alergias ? styles.inputError : ''}`}
                  placeholder="Ej: Alergia al maní, al polen..."
                  rows="3"
                  maxLength="500"
                />
                {errors.alergias && (
                  <span className={styles.errorText}>{errors.alergias.message}</span>
                )}
              </div>

              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="condicionesMedicas" className={styles.label}>
                  Condiciones Médicas Relevantes (Opcional)
                </label>
                <textarea
                  id="condicionesMedicas"
                  {...register('condicionesMedicas')}
                  className={`${styles.textarea} ${errors.condicionesMedicas ? styles.inputError : ''}`}
                  placeholder="Ej: Asma, diabetes..."
                  rows="3"
                  maxLength="500"
                />
                {errors.condicionesMedicas && (
                  <span className={styles.errorText}>{errors.condicionesMedicas.message}</span>
                )}
              </div>

              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="medicamentos" className={styles.label}>
                  Medicamentos que Toma Regularmente (Opcional)
                </label>
                <textarea
                  id="medicamentos"
                  {...register('medicamentos')}
                  className={`${styles.textarea} ${errors.medicamentos ? styles.inputError : ''}`}
                  placeholder="Ej: Inhalador para el asma..."
                  rows="3"
                  maxLength="500"
                />
                {errors.medicamentos && (
                  <span className={styles.errorText}>{errors.medicamentos.message}</span>
                )}
              </div>
            </div>
          </div>
        );



      default:
        return null;
    }
  };

  return (
    <div className={styles.overlay} onClick={onCerrar}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitulo}>Formulario de Pre-inscripción</h2>
          <button
            type="button"
            onClick={onCerrar}
            className={styles.botonCerrar}
            aria-label="Cerrar formulario"
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className={styles.progressBar}>
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`${styles.progressStep} ${
                paso >= num ? styles.progressStepActivo : ''
              }`}
            >
              <div className={styles.progressNumero}>{num}</div>
              <div className={styles.progressLinea}></div>
            </div>
          ))}
        </div>

        {/* Contenido del formulario */}
        <form onSubmit={handleSubmit(paso === 3 ? onEnviar : onSiguiente)} className={styles.form}>
          {renderPaso()}

          {/* Botones de navegación */}
          <div className={styles.botonesNavegacion}>
            {paso > 1 && (
              <button
                type="button"
                onClick={onAnterior}
                className={styles.botonSecundario}
                disabled={enviando}
              >
                ← Anterior
              </button>
            )}
            <button
              type="submit"
              className={styles.botonPrincipal}
              disabled={enviando}
            >
              {enviando ? (
                <>
                  <span className={styles.spinner}></span>
                  Enviando...
                </>
              ) : paso === 3 ? (
                'Enviar formulario'
              ) : (
                'Siguiente →'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormPreinscripcion;
