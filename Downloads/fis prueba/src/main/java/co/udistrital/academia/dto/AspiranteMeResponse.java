package co.udistrital.academia.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO de respuesta con información del aspirante autenticado
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AspiranteMeResponse {
    
    private Long id;
    private String nombre;
    private String correo;
    private String estado;
}
