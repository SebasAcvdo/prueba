package co.udistrital.academia.controller;

import co.udistrital.academia.dto.CitacionRequest;
import co.udistrital.academia.dto.CitacionResponse;
import co.udistrital.academia.service.CitacionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/citaciones")
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "5. Gestión de Citaciones", description = "C.U 1, 2, 4, 5 - Administración de citaciones")
public class CitacionController {

    @Autowired
    private CitacionService citacionService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESOR')")
    @Operation(summary = "C.U 1 - Crear citación", 
               description = "Crea una citación INDIVIDUAL (1 acudiente+1 profesor), GRUPAL (N acudientes+1 profesor) o ASPIRANTE (1 aspirante+1 admin)")
    public ResponseEntity<CitacionResponse> crearCitacion(@Valid @RequestBody CitacionRequest request) {
        CitacionResponse response = citacionService.crearCitacion(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/page")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESOR') or hasRole('ACUDIENTE')")
    @Operation(summary = "Listar citaciones paginadas", 
               description = "Lista citaciones paginadas con filtros opcionales por tipo y estado")
    public ResponseEntity<Page<CitacionResponse>> listarCitacionesPaginadas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String estado) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CitacionResponse> citaciones = citacionService.listarCitacionesPaginadas(pageable, tipo, estado);
        return ResponseEntity.ok(citaciones);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESOR') or hasRole('ACUDIENTE')")
    @Operation(summary = "C.U 2, 4, 5 - Listar citaciones por tipo", 
               description = "Lista citaciones filtradas por tipo: INDIVIDUAL, GRUPAL o ASPIRANTE")
    public ResponseEntity<List<CitacionResponse>> listarCitaciones(@RequestParam String tipo) {
        List<CitacionResponse> citaciones = citacionService.listarPorTipo(tipo);
        return ResponseEntity.ok(citaciones);
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "C.U - Cambiar estado de citación", 
               description = "Actualiza el estado de una citación (PENDIENTE, REALIZADA, CANCELADA)")
    public ResponseEntity<CitacionResponse> cambiarEstado(
            @PathVariable Long id,
            @RequestParam String estado) {
        CitacionResponse response = citacionService.cambiarEstado(id, estado);
        return ResponseEntity.ok(response);
    }
}
