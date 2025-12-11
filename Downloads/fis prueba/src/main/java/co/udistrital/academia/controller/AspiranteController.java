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

    @Autowired
    private co.udistrital.academia.service.FormularioPreinscripcionService formularioService;

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

    @PostMapping("/solicitar-clave")
    @Operation(summary = "Solicitar clave temporal", 
               description = "Endpoint público para que aspirantes soliciten clave temporal")
    public ResponseEntity<co.udistrital.academia.dto.ClaveTemporalResponse> solicitarClaveTemporal(
            @Valid @RequestBody co.udistrital.academia.dto.SolicitudClaveTemporalRequest request) {
        co.udistrital.academia.dto.ClaveTemporalResponse response = aspiranteService.solicitarClaveTemporal(request.getCorreo());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('ASPIRANTE')")
    @Operation(summary = "Obtener datos del aspirante autenticado", 
               description = "Retorna información del aspirante logueado")
    public ResponseEntity<co.udistrital.academia.dto.AspiranteMeResponse> obtenerDatosAspirante(
            @RequestAttribute("usuarioId") Long usuarioId) {
        co.udistrital.academia.dto.AspiranteMeResponse response = aspiranteService.obtenerDatosAspirante(usuarioId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/estado")
    @PreAuthorize("hasRole('ASPIRANTE') or hasRole('ADMIN')")
    @Operation(summary = "Obtener estado de pre-inscripción", 
               description = "Retorna el estado actual y fecha de entrevista si aplica")
    public ResponseEntity<co.udistrital.academia.dto.EstadoPreinscripcionResponse> obtenerEstadoPreinscripcion(
            @PathVariable Long id) {
        co.udistrital.academia.dto.EstadoPreinscripcionResponse response = aspiranteService.obtenerEstadoPreinscripcion(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/formulario")
    @PreAuthorize("hasRole('ASPIRANTE') or hasRole('ADMIN')")
    @Operation(summary = "Enviar formulario de pre-inscripción", 
               description = "Guarda formulario completo de pre-inscripción y actualiza estado a SIN_REVISAR")
    public ResponseEntity<co.udistrital.academia.dto.EstadoPreinscripcionResponse> enviarFormulario(
            @PathVariable Long id,
            @Valid @RequestBody co.udistrital.academia.dto.FormularioPreinscripcionRequest request) {
        co.udistrital.academia.dto.EstadoPreinscripcionResponse response = formularioService.guardarFormulario(id, request);
        return ResponseEntity.ok(response);
    }

    // ========== NUEVOS ENDPOINTS PÚBLICOS - FLUJO SIMPLE ==========
    
    @PostMapping("/preinscripcion-publica")
    @Operation(summary = "Crear preinscripción pública (sin autenticación)", 
               description = "Crea usuario aspirante, estudiante y devuelve clave temporal")
    public ResponseEntity<co.udistrital.academia.dto.PreinscripcionPublicaResponse> crearPreinscripcionPublica(
            @Valid @RequestBody co.udistrital.academia.dto.PreinscripcionPublicaRequest request) {
        co.udistrital.academia.dto.PreinscripcionPublicaResponse response = 
            aspiranteService.crearPreinscripcionPublica(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}/estado-publico")
    @Operation(summary = "Consultar estado de inscripción (sin autenticación)", 
               description = "Retorna estado, datos del estudiante y fecha de entrevista si existe")
    public ResponseEntity<co.udistrital.academia.dto.EstadoPublicoResponse> obtenerEstadoPublico(
            @PathVariable Long id) {
        co.udistrital.academia.dto.EstadoPublicoResponse response = 
            aspiranteService.obtenerEstadoPublico(id);
        return ResponseEntity.ok(response);
    }
}
