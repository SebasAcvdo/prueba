package co.udistrital.academia.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PreinscripcionPublicaRequest {
    
    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "Formato de correo inválido")
    private String correo;
    
    @NotBlank(message = "El nombre del acudiente es obligatorio")
    @Size(min = 3, max = 50, message = "El nombre debe tener entre 3 y 50 caracteres")
    private String nombreAcudiente;
    
    @NotBlank(message = "El apellido del acudiente es obligatorio")
    @Size(min = 3, max = 50, message = "El apellido debe tener entre 3 y 50 caracteres")
    private String apellidoAcudiente;
    
    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(regexp = "^\\d{10}$", message = "El teléfono debe tener exactamente 10 dígitos")
    private String telefono;
    
    @NotBlank(message = "El nombre del menor es obligatorio")
    @Size(min = 3, max = 50, message = "El nombre debe tener entre 3 y 50 caracteres")
    private String nombreMenor;
    
    @NotBlank(message = "El apellido del menor es obligatorio")
    @Size(min = 3, max = 50, message = "El apellido debe tener entre 3 y 50 caracteres")
    private String apellidoMenor;
    
    @NotBlank(message = "El grado es obligatorio")
    private String grado;
    
    @NotBlank(message = "La fecha de nacimiento es obligatoria")
    private String fechaNacimiento;
    
    @Size(max = 500, message = "Las alergias no pueden exceder 500 caracteres")
    private String alergias;
}
