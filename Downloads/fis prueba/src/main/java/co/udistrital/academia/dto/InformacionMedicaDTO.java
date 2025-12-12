package co.udistrital.academia.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para información médica en formulario de pre-inscripción
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InformacionMedicaDTO {
    
    private String alergias;
    private String condicionesMedicas;
    private String medicamentos;
}
