package co.udistrital.academia.dto;

import jakarta.validation.constraints.NotNull;

public record AddEstudianteRequest(
    @NotNull(message = "El ID del estudiante es obligatorio")
    Long estudianteId
) {}
