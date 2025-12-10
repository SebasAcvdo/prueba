package co.udistrital.academia.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record AspiranteCreateRequest(
    @NotBlank(message = "El nombre del usuario es obligatorio")
    String nombreUsuario,
    
    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo debe ser válido")
    String correo,
    
    @NotEmpty(message = "Debe incluir al menos un estudiante")
    @Valid
    List<EstudianteData> estudiantes
) {
    public record EstudianteData(
        @NotBlank(message = "El nombre del estudiante es obligatorio")
        String nombre,
        
        @NotBlank(message = "El apellido del estudiante es obligatorio")
        String apellido,
        
        @NotBlank(message = "El grado es obligatorio")
        String grado,
        
        String regCivil
    ) {}
}
