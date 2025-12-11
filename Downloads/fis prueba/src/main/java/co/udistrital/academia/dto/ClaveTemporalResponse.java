package co.udistrital.academia.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO de respuesta con clave temporal
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaveTemporalResponse {
    
    private String claveTemporal;
    private Long aspiranteId;
}
