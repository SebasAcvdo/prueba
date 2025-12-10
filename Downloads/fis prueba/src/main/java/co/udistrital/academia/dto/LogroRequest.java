package co.udistrital.academia.dto;

import jakarta.validation.constraints.NotBlank;

public record LogroRequest(
    @NotBlank(message = "El nombre del logro es obligatorio")
    String nombre,
    
    String descripcion,
    
    @NotBlank(message = "La categoría es obligatoria")
    String categoria
) {}
