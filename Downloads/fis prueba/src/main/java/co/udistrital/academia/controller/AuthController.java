package co.udistrital.academia.controller;

import co.udistrital.academia.dto.FirstLoginRequest;
import co.udistrital.academia.dto.LoginRequest;
import co.udistrital.academia.dto.TokenResponse;
import co.udistrital.academia.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "1. Autenticación", description = "C.U 25, 26 - Gestión de autenticación y primer login")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "C.U 25 - Login de usuarios", description = "Permite autenticarse con correo y contraseña")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        TokenResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/first-login")
    @Operation(summary = "C.U 26 - Primer login con cambio de contraseña", 
               description = "Permite cambiar la contraseña temporal en el primer acceso")
    public ResponseEntity<TokenResponse> firstLogin(@Valid @RequestBody FirstLoginRequest request) {
        TokenResponse response = authService.firstLogin(request);
        return ResponseEntity.ok(response);
    }
}
