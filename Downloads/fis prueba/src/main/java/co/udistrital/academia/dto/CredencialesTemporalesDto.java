package co.udistrital.academia.dto;

public record CredencialesTemporalesDto(
    Long usuarioId,
    String usuarioTemporal,
    String passwordTemporal
) {}
