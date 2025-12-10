package co.udistrital.academia.controller;

import co.udistrital.academia.dto.AspiranteCreateRequest;
import co.udistrital.academia.entity.Aspirante;
import co.udistrital.academia.service.AspiranteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/aspirantes")
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "4. Gestión de Aspirantes", description = "C.U 28, 30, 31 - Administración de aspirantes")
public class AspiranteController {

    @Autowired
    private AspiranteService aspiranteService;

    @GetMapping("/page")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar aspirantes paginados", 
               description = "Obtiene lista paginada de aspirantes con filtro opcional por estado")
    public ResponseEntity<Page<Aspirante>> listarAspirantes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String estado) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Aspirante> aspirantes = aspiranteService.listarAspirantes(pageable, estado);
        return ResponseEntity.ok(aspirantes);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar todos los aspirantes", 
               description = "Obtiene lista completa de aspirantes sin paginación")
    public ResponseEntity<List<Aspirante>> listarTodosLosAspirantes() {
        List<Aspirante> aspirantes = aspiranteService.listarTodos();
        return ResponseEntity.ok(aspirantes);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('ASPIRANTE')")
    @Operation(summary = "C.U 28 - Crear aspirante", 
               description = "Registra un nuevo aspirante con mínimo 1 estudiante")
    public ResponseEntity<Aspirante> crearAspirante(@Valid @RequestBody AspiranteCreateRequest request) {
        Aspirante response = aspiranteService.crearAspirante(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "C.U 30 - Cambiar estado de aspirante", 
               description = "Actualiza el estado de inscripción (SIN_REVISAR, REVISADO, ESPERA_ENTREVISTA, etc.)")
    public ResponseEntity<Aspirante> cambiarEstado(
            @PathVariable Long id,
            @RequestParam String estado) {
        Aspirante response = aspiranteService.cambiarEstado(id, estado);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/entrevista")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "C.U 31 - Agendar entrevista a aspirante", 
               description = "Agenda fecha de entrevista y cambia estado a ESPERA_ENTREVISTA")
    public ResponseEntity<Aspirante> agendarEntrevista(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        Aspirante response = aspiranteService.agendarEntrevista(id, fecha);
        return ResponseEntity.ok(response);
    }
}
