package co.udistrital.academia.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para solicitar clave temporal de aspirante
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudClaveTemporalRequest {
    
    @NotBlank(message = "El correo es requerido")
    @Email(message = "Debe ser un correo electrónico válido")
    private String correo;
}
