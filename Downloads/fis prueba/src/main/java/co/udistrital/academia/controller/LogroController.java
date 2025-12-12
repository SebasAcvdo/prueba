package co.udistrital.academia.controller;

import co.udistrital.academia.dto.LogroRequest;
import co.udistrital.academia.entity.Logro;
import co.udistrital.academia.service.LogroService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logros")
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "6. Gestión de Logros", description = "CRUD de logros por categoría")
public class LogroController {

    @Autowired
    private LogroService logroService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Crear logro", 
               description = "Crea un nuevo logro con categoría PERSONAL_SOCIAL, COGNITIVO_LENGUAJE o AREA_MOTRIZ")
    public ResponseEntity<Logro> crearLogro(@Valid @RequestBody LogroRequest request) {
        Logro response = logroService.crearLogro(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESOR')")
    @Operation(summary = "Listar todos los logros", description = "Obtiene lista completa de logros")
    public ResponseEntity<List<Logro>> listarLogros() {
        List<Logro> logros = logroService.listarLogros();
        return ResponseEntity.ok(logros);
    }

    @GetMapping("/categoria/{categoria}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESOR')")
    @Operation(summary = "Listar logros por categoría", description = "Filtra logros por categoría específica")
    public ResponseEntity<List<Logro>> listarPorCategoria(@PathVariable String categoria) {
        List<Logro> logros = logroService.listarPorCategoria(categoria);
        return ResponseEntity.ok(logros);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Actualizar logro", description = "Actualiza los datos de un logro existente")
    public ResponseEntity<Logro> actualizarLogro(
            @PathVariable Long id,
            @Valid @RequestBody LogroRequest request) {
        Logro response = logroService.actualizarLogro(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar logro", description = "Elimina un logro del sistema")
    public ResponseEntity<Void> eliminarLogro(@PathVariable Long id) {
        logroService.eliminarLogro(id);
        return ResponseEntity.noContent().build();
    }
}
