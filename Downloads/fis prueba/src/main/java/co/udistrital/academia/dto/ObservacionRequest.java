package co.udistrital.academia.dto;

import co.udistrital.academia.entity.Observacion;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record ObservacionRequest(
    @NotNull(message = "La fecha es obligatoria")
    LocalDate fecha,
    
    @NotBlank(message = "La descripción es obligatoria")
    String descripcion,
    
    @NotNull(message = "El tipo es obligatorio")
    Observacion.TipoObservacion tipo,
    
    @NotNull(message = "El ID del estudiante es obligatorio")
    Long estudianteId
) {}
