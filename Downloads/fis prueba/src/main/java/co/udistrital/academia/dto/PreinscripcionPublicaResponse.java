package co.udistrital.academia.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PreinscripcionPublicaResponse {
    private String claveTemporal;
    private Long aspiranteId;
    private Long estudianteId;
}
