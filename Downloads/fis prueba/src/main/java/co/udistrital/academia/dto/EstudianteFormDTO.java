package co.udistrital.academia.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO para datos del estudiante en formulario de pre-inscripción
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstudianteFormDTO {
    
    @NotBlank(message = "El nombre es requerido")
    private String nombre;
    
    @NotBlank(message = "El apellido es requerido")
    private String apellido;
    
    @NotBlank(message = "El grado aspirado es requerido")
    private String gradoAspirado;
    
    @NotNull(message = "La fecha de nacimiento es requerida")
    private LocalDate fechaNacimiento;
    
    @NotBlank(message = "El registro civil es requerido")
    private String registroCivil;
}
