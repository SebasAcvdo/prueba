package co.udistrital.academia.dto;

public record TokenResponse(
    String accessToken,
    String tokenType,
    Long expiresIn,
    String rol
) {
    public TokenResponse(String accessToken, Long expiresIn, String rol) {
        this(accessToken, "Bearer", expiresIn, rol);
    }
}
