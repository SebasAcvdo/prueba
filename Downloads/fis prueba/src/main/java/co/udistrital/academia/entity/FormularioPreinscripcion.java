package co.udistrital.academia.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entidad para almacenar formularios de pre-inscripción
 */
@Entity
@Table(name = "formulario_preinscripcion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormularioPreinscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "aspirante_id", nullable = false)
    private Aspirante aspirante;

    // Datos del acudiente
    @Column(name = "acudiente_nombre", length = 100)
    private String acudienteNombre;

    @Column(name = "acudiente_apellido", length = 100)
    private String acudienteApellido;

    @Column(name = "acudiente_telefono", length = 20)
    private String acudienteTelefono;

    @Column(name = "acudiente_correo", length = 120)
    private String acudienteCorreo;

    // Datos del estudiante
    @Column(name = "estudiante_nombre", length = 100)
    private String estudianteNombre;

    @Column(name = "estudiante_apellido", length = 100)
    private String estudianteApellido;

    @Column(name = "grado_aspirado", length = 50)
    private String gradoAspirado;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Column(name = "registro_civil", length = 50)
    private String registroCivil;

    // Información médica
    @Column(name = "alergias", length = 500)
    private String alergias;

    @Column(name = "condiciones_medicas", length = 500)
    private String condicionesMedicas;

    @Column(name = "medicamentos", length = 500)
    private String medicamentos;

    @Column(name = "fecha_registro")
    @Builder.Default
    private LocalDateTime fechaRegistro = LocalDateTime.now();
}
