package co.udistrital.academia.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para el formulario completo de pre-inscripción
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormularioPreinscripcionRequest {
    
    @NotNull(message = "Los datos del acudiente son requeridos")
    @Valid
    private AcudienteFormDTO acudiente;
    
    @NotNull(message = "Los datos del estudiante son requeridos")
    @Valid
    private EstudianteFormDTO estudiante;
    
    private InformacionMedicaDTO medico;
}
