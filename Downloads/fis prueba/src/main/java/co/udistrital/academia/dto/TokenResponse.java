package co.udistrital.academia.dto;

public record TokenResponse(
    String accessToken,
    String tokenType,
    Long expiresIn,
    Long usuarioId,
    String nombre,
    String correo,
    String rol
) {
    public TokenResponse(String accessToken, Long expiresIn, Long usuarioId, String nombre, String correo, String rol) {
        this(accessToken, "Bearer", expiresIn, usuarioId, nombre, correo, rol);
    }
}
