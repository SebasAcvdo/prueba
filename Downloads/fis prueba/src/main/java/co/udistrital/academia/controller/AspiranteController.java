package co.udistrital.academia.controller;

import co.udistrital.academia.dto.AspiranteCreateRequest;
import co.udistrital.academia.dto.AspiranteResponse;
import co.udistrital.academia.dto.EstadoAspiranteRequest;
import co.udistrital.academia.service.AspiranteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/aspirantes")
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "4. Gestión de Aspirantes", description = "C.U 28, 30, 31 - Administración de aspirantes")
public class AspiranteController {

    @Autowired
    private AspiranteService aspiranteService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('ASPIRANTE')")
    @Operation(summary = "C.U 28 - Crear aspirante", 
               description = "Registra un nuevo aspirante con mínimo 1 estudiante")
    public ResponseEntity<AspiranteResponse> crearAspirante(@Valid @RequestBody AspiranteCreateRequest request) {
        AspiranteResponse response = aspiranteService.crearAspirante(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "C.U 30 - Cambiar estado de aspirante", 
               description = "Actualiza el estado de inscripción (SIN_REVISAR, REVISADO, ESPERA_ENTREVISTA, etc.)")
    public ResponseEntity<AspiranteResponse> cambiarEstado(
            @PathVariable Long id,
            @Valid @RequestBody EstadoAspiranteRequest request) {
        AspiranteResponse response = aspiranteService.cambiarEstado(id, request.estado());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/entrevista")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "C.U 31 - Agendar entrevista a aspirante", 
               description = "Agenda fecha de entrevista y cambia estado a ESPERA_ENTREVISTA")
    public ResponseEntity<AspiranteResponse> agendarEntrevista(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        AspiranteResponse response = aspiranteService.agendarEntrevista(id, fecha);
        return ResponseEntity.ok(response);
    }
}
