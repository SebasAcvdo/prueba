package co.udistrital.academia.dto;

public record EstudianteSimpleResponse(
    Long id,
    String nombre,
    String apellido,
    String grado,
    String regCivil,
    String estado
) {}
