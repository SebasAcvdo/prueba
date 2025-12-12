package co.udistrital.academia.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO de respuesta con estado de pre-inscripción
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstadoPreinscripcionResponse {
    
    private String estado;
    private LocalDate fechaEntrevista;
}
