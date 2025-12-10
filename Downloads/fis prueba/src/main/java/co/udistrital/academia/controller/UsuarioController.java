package co.udistrital.academia.controller;

import co.udistrital.academia.dto.UsuarioRequest;
import co.udistrital.academia.dto.UsuarioResponse;
import co.udistrital.academia.dto.UsuarioUpdateRequest;
import co.udistrital.academia.service.UsuarioService;
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

@RestController
@RequestMapping("/api/usuarios")
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "2. Gestión de Usuarios", description = "C.U 17, 17.1, 18, 20 - CRUD de usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/page")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "C.U 18 - Listar usuarios paginados", description = "Obtiene lista paginada de usuarios")
    public ResponseEntity<Page<UsuarioResponse>> listarUsuarios(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UsuarioResponse> usuarios = usuarioService.listarUsuarios(pageable);
        return ResponseEntity.ok(usuarios);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "C.U 17 - Crear usuario", 
               description = "Crea un nuevo usuario con credenciales temporales")
    public ResponseEntity<UsuarioResponse> crearUsuario(@Valid @RequestBody UsuarioRequest request) {
        UsuarioResponse response = usuarioService.crearUsuario(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "C.U 17.1 - Actualizar usuario", description = "Actualiza los datos de un usuario")
    public ResponseEntity<UsuarioResponse> actualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioUpdateRequest request) {
        UsuarioResponse response = usuarioService.actualizarUsuario(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "C.U 20 - Habilitar/Deshabilitar usuario", 
               description = "Cambia el estado activo/inactivo de un usuario")
    public ResponseEntity<UsuarioResponse> cambiarEstado(
            @PathVariable Long id,
            @RequestParam Boolean estado) {
        UsuarioResponse response = usuarioService.cambiarEstado(id, estado);
        return ResponseEntity.ok(response);
    }
}
