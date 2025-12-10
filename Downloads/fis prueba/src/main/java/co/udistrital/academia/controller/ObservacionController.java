package co.udistrital.academia.controller;

import co.udistrital.academia.dto.ObservacionRequest;
import co.udistrital.academia.entity.Observacion;
import co.udistrital.academia.service.ObservacionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/observaciones")
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "8. Observador del Estudiante", description = "C.U 24, 25 - Gestión del observador")
public class ObservacionController {
    
    @Autowired
    private ObservacionService observacionService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESOR') or hasRole('ACUDIENTE')")
    @Operation(summary = "C.U 24 - Consultar observaciones", 
               description = "Lista observaciones de un estudiante ordenadas por fecha")
    public ResponseEntity<List<Observacion>> listarObservaciones(
            @RequestParam Long estudianteId) {
        List<Observacion> observaciones = observacionService.listarPorEstudiante(estudianteId);
        return ResponseEntity.ok(observaciones);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('PROFESOR')")
    @Operation(summary = "C.U 25 - Agregar observación", 
               description = "Crea una nueva observación para un estudiante")
    public ResponseEntity<Observacion> crearObservacion(
            @Valid @RequestBody ObservacionRequest request,
            Authentication authentication) {
        Long profesorId = Long.parseLong(authentication.getName());
        Observacion observacion = observacionService.crearObservacion(request, profesorId);
        return ResponseEntity.status(HttpStatus.CREATED).body(observacion);
    }
}
