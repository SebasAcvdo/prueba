package co.udistrital.academia.dto;

public record LogroResponse(
    Long id,
    String nombre,
    String descripcion,
    String categoria,
    String estado
) {}
