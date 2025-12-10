package co.udistrital.academia.dto;

import java.time.LocalDate;
import java.util.List;

public record AspiranteResponse(
    Long id,
    String estadoInscripcion,
    LocalDate fechaEntrevista,
    UsuarioResponse usuario,
    List<EstudianteSimpleResponse> estudiantes
) {}
