package co.udistrital.academia.dto;

public record UsuarioResponse(
    Long id,
    String nombre,
    String correo,
    String rol,
    Boolean estado,
    String usuarioTemporal,
    String contrasenaTemporal
) {}
