package co.udistrital.academia.dto;

import jakarta.validation.constraints.NotBlank;

public record EstadoUsuarioRequest(
    @NotBlank(message = "El estado es obligatorio")
    Boolean estado
) {}
