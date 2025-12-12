package co.udistrital.academia.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EstadoPublicoResponse {
    private String estado;
    private String fechaEntrevista;
    private EstudianteInfo estudiante;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EstudianteInfo {
        private String nombre;
        private String apellido;
        private String grado;
        private String fechaNacimiento;
    }
}
