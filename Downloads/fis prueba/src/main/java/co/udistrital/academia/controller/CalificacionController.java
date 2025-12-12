package co.udistrital.academia.controller;

import co.udistrital.academia.dto.CalificacionRequest;
import co.udistrital.academia.dto.CalificacionResponse;
import co.udistrital.academia.service.CalificacionService;
import co.udistrital.academia.service.ReporteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calificaciones")
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "7. Gestión de Calificaciones", description = "C.U 7, 8, 9, 10 - Administración de calificaciones y reportes")
public class CalificacionController {

    @Autowired
    private CalificacionService calificacionService;

    @Autowired
    private ReporteService reporteService;

    @GetMapping("/page")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESOR')")
    @Operation(summary = "Listar calificaciones paginadas", 
               description = "Lista calificaciones paginadas con filtros opcionales")
    public ResponseEntity<Page<CalificacionResponse>> listarCalificacionesPaginadas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Long estudianteId,
            @RequestParam(required = false) Integer periodo) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CalificacionResponse> calificaciones = calificacionService.listarCalificacionesPaginadas(pageable, estudianteId, periodo);
        return ResponseEntity.ok(calificaciones);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESOR') or hasRole('ACUDIENTE')")
    @Operation(summary = "C.U 7 - Consultar calificaciones", 
               description = "Consulta calificaciones de un estudiante, opcionalmente por periodo")
    public ResponseEntity<List<CalificacionResponse>> consultarCalificaciones(
            @RequestParam Long estudianteId,
            @RequestParam(required = false) Integer periodo) {
        List<CalificacionResponse> calificaciones = calificacionService.consultarCalificaciones(estudianteId, periodo);
        return ResponseEntity.ok(calificaciones);
    }

    @GetMapping("/reporte/boletin")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESOR') or hasRole('ACUDIENTE')")
    @Operation(summary = "C.U 8 - Generar boletín PDF", 
               description = "Genera boletín de calificaciones de un estudiante en formato PDF")
    public ResponseEntity<byte[]> generarBoletin(
            @RequestParam Long estudianteId,
            @RequestParam(required = false) Integer periodo) {
        byte[] pdfBytes = reporteService.generarBoletin(estudianteId, periodo);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "boletin_estudiante_" + estudianteId + ".pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasRole('PROFESOR')")
    @Operation(summary = "C.U 9 - Crear calificación", 
               description = "Registra una nueva calificación (valor entre 1.0 y 5.0)")
    public ResponseEntity<CalificacionResponse> crearCalificacion(@Valid @RequestBody CalificacionRequest request) {
        CalificacionResponse response = calificacionService.crearCalificacion(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PROFESOR')")
    @Operation(summary = "C.U 10 - Modificar calificación", 
               description = "Actualiza una calificación existente (solo el profesor que la creó)")
    public ResponseEntity<CalificacionResponse> actualizarCalificacion(
            @PathVariable Long id,
            @Valid @RequestBody CalificacionRequest request) {
        CalificacionResponse response = calificacionService.actualizarCalificacion(id, request);
        return ResponseEntity.ok(response);
    }
}
