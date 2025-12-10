package co.udistrital.academia.dto;

import jakarta.validation.constraints.NotBlank;

public record EstadoAspiranteRequest(
    @NotBlank(message = "El estado es obligatorio")
    String estado
) {}
