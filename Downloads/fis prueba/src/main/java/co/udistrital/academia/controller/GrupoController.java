package co.udistrital.academia.controller;

import co.udistrital.academia.dto.AddEstudianteRequest;
import co.udistrital.academia.dto.GrupoRequest;
import co.udistrital.academia.entity.Grupo;
import co.udistrital.academia.service.GrupoService;
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
@RequestMapping("/api/grupos")
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "3. Gestión de grupos y matrículas", description = "C.U 32, 33, 34 - Administración de grupos")
public class GrupoController {

    @Autowired
    private GrupoService grupoService;

    @Autowired
    private ReporteService reporteService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "C.U 32 - Creación de grupos", 
               description = "Crea un nuevo grupo en estado BORRADOR con capacidad máxima 20")
    public ResponseEntity<Grupo> crearGrupo(@Valid @RequestBody GrupoRequest request) {
        Grupo response = grupoService.crearGrupo(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{id}/confirmar")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "C.U 33 - Confirmar grupo", 
               description = "Confirma un grupo cambiando su estado de BORRADOR a ACTIVO")
    public ResponseEntity<Grupo> confirmarGrupo(@PathVariable Long id) {
        Grupo response = grupoService.confirmarGrupo(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/listado.pdf")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESOR')")
    @Operation(summary = "C.U 34 - Generar listado de grupo en PDF", 
               description = "Genera y descarga un PDF con el listado de estudiantes del grupo")
    public ResponseEntity<byte[]> generarListadoPdf(@PathVariable Long id) {
        byte[] pdfBytes = reporteService.generarListadoGrupo(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "listado_grupo_" + id + ".pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    @GetMapping("/page")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESOR')")
    @Operation(summary = "Listar grupos paginados", 
               description = "Obtiene lista paginada de grupos con filtro opcional por estado")
    public ResponseEntity<Page<Grupo>> listarGruposPaginados(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String estado) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Grupo> grupos = grupoService.listarGruposPaginados(pageable, estado);
        return ResponseEntity.ok(grupos);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESOR')")
    @Operation(summary = "Listar todos los grupos", description = "Obtiene la lista completa de grupos con filtro opcional por profesor")
    public ResponseEntity<List<co.udistrital.academia.dto.GrupoResponse>> listarGrupos(@RequestParam(required = false) Long profesorId) {
        List<co.udistrital.academia.dto.GrupoResponse> grupos = grupoService.listarGrupos(profesorId);
        return ResponseEntity.ok(grupos);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESOR')")
    @Operation(summary = "Obtener grupo por ID", description = "Obtiene los detalles de un grupo específico")
    public ResponseEntity<Grupo> obtenerGrupo(@PathVariable Long id) {
        Grupo response = grupoService.obtenerGrupo(id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar grupo", description = "Elimina un grupo del sistema")
    public ResponseEntity<Void> eliminarGrupo(@PathVariable Long id) {
        grupoService.eliminarGrupo(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/estudiantes")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Asignar estudiantes al grupo", description = "Asigna una lista de estudiantes a un grupo")
    public ResponseEntity<Grupo> asignarEstudiantes(
            @PathVariable Long id,
            @RequestBody List<Long> estudianteIds) {
        Grupo response = grupoService.asignarEstudiantes(id, estudianteIds);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/estudiantes")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Agregar estudiante al grupo", description = "Agrega un estudiante al grupo")
    public ResponseEntity<Grupo> agregarEstudiante(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, Long> request) {
        Long estudianteId = request.get("estudianteId");
        Grupo response = grupoService.agregarEstudiante(id, estudianteId);
        return ResponseEntity.ok(response);
    }
}
