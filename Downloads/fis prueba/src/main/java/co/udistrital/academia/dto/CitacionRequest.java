package co.udistrital.academia.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public record CitacionRequest(
    @NotBlank(message = "El tipo de citación es obligatorio")
    String tipo,
    
    @NotNull(message = "La fecha es obligatoria")
    LocalDateTime fecha,
    
    @NotBlank(message = "El motivo es obligatorio")
    String motivo,
    
    List<Long> acudienteIds,
    
    List<Long> profesorIds,
    
    List<Long> aspiranteIds
) {}
