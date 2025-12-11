package co.udistrital.academia.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para datos del acudiente en formulario de pre-inscripción
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AcudienteFormDTO {
    
    private String nombre;
    private String apellido;
    private String telefono;
    private String correo;
}
