package co.udistrital.academia.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para autorizaciones en formulario de pre-inscripción
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AutorizacionesDTO {
    
    private Boolean datos;
    private Boolean imagenes;
    private Boolean salidas;
}
