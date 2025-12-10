package co.udistrital.academia.dto;

import jakarta.validation.constraints.NotBlank;

public record FirstLoginRequest(
    @NotBlank(message = "El correo es obligatorio")
    String correo,
    
    @NotBlank(message = "La contraseña temporal es obligatoria")
    String passwordTemporal,
    
    @NotBlank(message = "La nueva contraseña es obligatoria")
    String nuevaPassword
) {}
