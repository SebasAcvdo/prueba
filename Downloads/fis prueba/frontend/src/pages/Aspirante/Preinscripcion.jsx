import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { usePreinscripcion } from './hooks/usePreinscripcion';
import ClaveTemporalModal from './ClaveTemporalModal';
import styles from './Preinscripcion.module.css';

// Esquema de validación con Zod
const preinscripcionSchema = z.object({
  // Datos del acudiente
  correo: z.string()
    .min(1, 'El correo es obligatorio')
    .email('Correo electrónico inválido'),
  nombreAcudiente: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  apellidoAcudiente: z.string()
    .min(3, 'El apellido debe tener al menos 3 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres'),
  telefono: z.string()
    .regex(/^\d{10}$/, 'El teléfono debe tener exactamente 10 dígitos'),
  
  // Datos del menor
  nombreMenor: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  apellidoMenor: z.string()
    .min(3, 'El apellido debe tener al menos 3 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres'),
  grado: z.enum(['Párvulos', 'Caminadores', 'Pre-jardín'], {
    errorMap: () => ({ message: 'Debe seleccionar un grado válido' })
  }),
  fechaNacimiento: z.string()
    .min(1, 'La fecha de nacimiento es obligatoria')
    .refine((fecha) => {
      const fechaNac = new Date(fecha);
      const hoy = new Date();
      const edad = (hoy - fechaNac) / (1000 * 60 * 60 * 24 * 365);
      return edad >= 3;
    }, 'El menor debe tener al menos 3 años de edad'),
  
  // Información médica (opcional)
  alergias: z.string().max(500, 'Las alergias no pueden exceder 500 caracteres').optional()
});

export default function Preinscripcion() {
  const navigate = useNavigate();
  const { loading, error, resultado, mostrarModal, enviarPreinscripcion, cerrarModal } = usePreinscripcion();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(preinscripcionSchema)
  });

  const onSubmit = async (data) => {
    try {
      await enviarPreinscripcion(data);
    } catch (err) {
      console.error('Error al enviar preinscripción:', err);
    }
  };

  const handleVerEstado = () => {
    cerrarModal();
    navigate('/aspirante/estado');
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Pre-inscripción</h1>
        <p className={styles.subtitle}>
          Completa el formulario para iniciar el proceso de inscripción de tu hijo(a)
        </p>

        {error && (
          <div className={styles.errorAlert} role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* SECCIÓN: DATOS DEL ACUDIENTE */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Datos del Acudiente</legend>

            <div className={styles.formGroup}>
              <label htmlFor="correo" className={styles.label}>
                Correo Electrónico <span className={styles.required}>*</span>
              </label>
              <input
                id="correo"
                type="email"
                className={`${styles.input} ${errors.correo ? styles.inputError : ''}`}
                {...register('correo')}
                placeholder="ejemplo@correo.com"
              />
              {errors.correo && (
                <span className={styles.errorText}>{errors.correo.message}</span>
              )}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="nombreAcudiente" className={styles.label}>
                  Nombre <span className={styles.required}>*</span>
                </label>
                <input
                  id="nombreAcudiente"
                  type="text"
                  className={`${styles.input} ${errors.nombreAcudiente ? styles.inputError : ''}`}
                  {...register('nombreAcudiente')}
                  placeholder="Juan"
                />
                {errors.nombreAcudiente && (
                  <span className={styles.errorText}>{errors.nombreAcudiente.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="apellidoAcudiente" className={styles.label}>
                  Apellido <span className={styles.required}>*</span>
                </label>
                <input
                  id="apellidoAcudiente"
                  type="text"
                  className={`${styles.input} ${errors.apellidoAcudiente ? styles.inputError : ''}`}
                  {...register('apellidoAcudiente')}
                  placeholder="Pérez"
                />
                {errors.apellidoAcudiente && (
                  <span className={styles.errorText}>{errors.apellidoAcudiente.message}</span>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="telefono" className={styles.label}>
                Teléfono <span className={styles.required}>*</span>
              </label>
              <input
                id="telefono"
                type="tel"
                className={`${styles.input} ${errors.telefono ? styles.inputError : ''}`}
                {...register('telefono')}
                placeholder="3001234567"
                maxLength="10"
              />
              {errors.telefono && (
                <span className={styles.errorText}>{errors.telefono.message}</span>
              )}
            </div>
          </fieldset>

          {/* SECCIÓN: DATOS DEL MENOR */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Datos del Menor</legend>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="nombreMenor" className={styles.label}>
                  Nombre <span className={styles.required}>*</span>
                </label>
                <input
                  id="nombreMenor"
                  type="text"
                  className={`${styles.input} ${errors.nombreMenor ? styles.inputError : ''}`}
                  {...register('nombreMenor')}
                  placeholder="María"
                />
                {errors.nombreMenor && (
                  <span className={styles.errorText}>{errors.nombreMenor.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="apellidoMenor" className={styles.label}>
                  Apellido <span className={styles.required}>*</span>
                </label>
                <input
                  id="apellidoMenor"
                  type="text"
                  className={`${styles.input} ${errors.apellidoMenor ? styles.inputError : ''}`}
                  {...register('apellidoMenor')}
                  placeholder="Pérez"
                />
                {errors.apellidoMenor && (
                  <span className={styles.errorText}>{errors.apellidoMenor.message}</span>
                )}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="grado" className={styles.label}>
                  Grado al que aspira <span className={styles.required}>*</span>
                </label>
                <select
                  id="grado"
                  className={`${styles.input} ${errors.grado ? styles.inputError : ''}`}
                  {...register('grado')}
                >
                  <option value="">Seleccionar...</option>
                  <option value="Párvulos">Párvulos</option>
                  <option value="Caminadores">Caminadores</option>
                  <option value="Pre-jardín">Pre-jardín</option>
                </select>
                {errors.grado && (
                  <span className={styles.errorText}>{errors.grado.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="fechaNacimiento" className={styles.label}>
                  Fecha de Nacimiento <span className={styles.required}>*</span>
                </label>
                <input
                  id="fechaNacimiento"
                  type="date"
                  className={`${styles.input} ${errors.fechaNacimiento ? styles.inputError : ''}`}
                  {...register('fechaNacimiento')}
                  max={new Date().toISOString().split('T')[0]}
                />
                {errors.fechaNacimiento && (
                  <span className={styles.errorText}>{errors.fechaNacimiento.message}</span>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="alergias" className={styles.label}>
                Alergias o Condiciones Médicas
              </label>
              <textarea
                id="alergias"
                className={`${styles.textarea} ${errors.alergias ? styles.inputError : ''}`}
                {...register('alergias')}
                placeholder="Describe cualquier alergia, condición médica o medicamento que requiera..."
                rows="4"
              />
              {errors.alergias && (
                <span className={styles.errorText}>{errors.alergias.message}</span>
              )}
            </div>
          </fieldset>

          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar Pre-inscripción'}
          </button>
        </form>
      </div>

      {/* Modal de clave temporal */}
      {mostrarModal && resultado && (
        <ClaveTemporalModal
          claveTemporal={resultado.claveTemporal}
          onVerEstado={handleVerEstado}
        />
      )}
    </div>
  );
}
