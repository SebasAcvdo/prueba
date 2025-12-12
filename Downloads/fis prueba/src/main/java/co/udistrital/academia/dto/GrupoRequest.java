package co.udistrital.academia.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record GrupoRequest(
    @NotBlank(message = "El nombre del grupo es obligatorio")
    String nombre,
    
    @NotBlank(message = "El grado es obligatorio")
    String grado,
    
    @NotNull(message = "La capacidad es obligatoria")
    @Min(value = 1, message = "La capacidad mínima es 1")
    @Max(value = 10, message = "La capacidad máxima es 10")
    Integer capacidad,
    
    @NotNull(message = "El ID del profesor es obligatorio")
    Long profesorId
) {}
