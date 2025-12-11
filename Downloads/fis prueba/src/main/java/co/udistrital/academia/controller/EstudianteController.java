package co.udistrital.academia.controller;

import co.udistrital.academia.entity.Estudiante;
import co.udistrital.academia.service.EstudianteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estudiantes")
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "5. Gestión de Estudiantes", description = "Consulta de estudiantes")
public class EstudianteController {

    @Autowired
    private EstudianteService estudianteService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESOR') or hasRole('ACUDIENTE')")
    @Operation(summary = "Listar estudiantes", 
               description = "Obtiene lista de estudiantes. Si es acudiente, solo sus estudiantes")
    public ResponseEntity<List<Estudiante>> listarEstudiantes(@RequestParam(required = false) Long acudienteId) {
        List<Estudiante> estudiantes = estudianteService.listarEstudiantes(acudienteId);
        return ResponseEntity.ok(estudiantes);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESOR') or hasRole('ACUDIENTE')")
    @Operation(summary = "Obtener estudiante por ID")
    public ResponseEntity<Estudiante> obtenerEstudiante(@PathVariable Long id) {
        Estudiante estudiante = estudianteService.obtenerPorId(id);
        return ResponseEntity.ok(estudiante);
    }

    @DeleteMapping("/{id}/grupo")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Quitar estudiante de su grupo", description = "Desasigna un estudiante de su grupo actual")
    public ResponseEntity<Void> quitarDeGrupo(@PathVariable Long id) {
        estudianteService.quitarDeGrupo(id);
        return ResponseEntity.noContent().build();
    }
}
