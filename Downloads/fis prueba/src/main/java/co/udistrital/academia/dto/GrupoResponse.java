package co.udistrital.academia.dto;

import java.util.List;

public record GrupoResponse(
    Long id,
    String nombre,
    String grado,
    Integer capacidad,
    String estado,
    String profesorNombre,
    Integer cantidadEstudiantes,
    List<EstudianteSimpleResponse> estudiantes
) {}
