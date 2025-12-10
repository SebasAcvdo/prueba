package co.udistrital.academia.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record CalificacionRequest(
    @NotNull(message = "El valor es obligatorio")
    @DecimalMin(value = "1.0", message = "La calificación mínima es 1.0")
    @DecimalMax(value = "5.0", message = "La calificación máxima es 5.0")
    Double valor,
    
    @NotNull(message = "El periodo es obligatorio")
    Integer periodo,
    
    @NotNull(message = "El ID del logro es obligatorio")
    Long logroId,
    
    @NotNull(message = "El ID del estudiante es obligatorio")
    Long estudianteId
) {}
