package co.udistrital.academia.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UsuarioUpdateRequest(
    @NotBlank(message = "El nombre es obligatorio")
    String nombre,
    
    @Email(message = "El correo debe ser válido")
    String correo
) {}
