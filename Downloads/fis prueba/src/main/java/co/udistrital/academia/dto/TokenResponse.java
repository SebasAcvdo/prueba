package co.udistrital.academia.dto;

public record TokenResponse(
    String accessToken,
    String tokenType,
    Long expiresIn,
    Long usuarioId,
    String nombre,
    String correo,
    String rol,
    Boolean cambiarPass
) {
    public TokenResponse(String accessToken, Long expiresIn, Long usuarioId, String nombre, String correo, String rol, Boolean cambiarPass) {
        this(accessToken, "Bearer", expiresIn, usuarioId, nombre, correo, rol, cambiarPass);
    }
}
