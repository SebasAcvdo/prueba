package co.udistrital.academia.dto;

import java.time.LocalDateTime;
import java.util.List;

public record CitacionResponse(
    Long id,
    String tipo,
    LocalDateTime fecha,
    String motivo,
    String estadoCita,
    List<UsuarioSimpleDTO> acudientes,
    List<UsuarioSimpleDTO> profesores,
    List<AspiranteSimpleDTO> aspirantes
) {}
