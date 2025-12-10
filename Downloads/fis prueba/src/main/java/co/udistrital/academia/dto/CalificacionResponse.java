package co.udistrital.academia.dto;

public record CalificacionResponse(
    Long id,
    Double valor,
    Integer periodo,
    LogroResponse logro,
    EstudianteSimpleResponse estudiante,
    String profesorNombre
) {}
