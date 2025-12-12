package co.udistrital.academia.service;

import co.udistrital.academia.config.JwtTokenProvider;
import co.udistrital.academia.dto.FirstLoginRequest;
import co.udistrital.academia.dto.LoginRequest;
import co.udistrital.academia.dto.TokenResponse;
import co.udistrital.academia.entity.TokenUsuario;
import co.udistrital.academia.entity.Usuario;
import co.udistrital.academia.exception.InvalidOperationException;
import co.udistrital.academia.exception.ResourceNotFoundException;
import co.udistrital.academia.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public TokenResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByCorreo(request.correo())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (!usuario.getEstado()) {
            throw new InvalidOperationException("Usuario deshabilitado");
        }

        // Verificar si debe cambiar contraseña
        Boolean cambiarPass = usuario.getTokenUsuario() != null && 
                              usuario.getTokenUsuario().getCambiarPass() != null &&
                              usuario.getTokenUsuario().getCambiarPass();

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.correo(), request.password())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return new TokenResponse(jwt, tokenProvider.getJwtExpirationInMs(), 
            usuario.getId(), usuario.getNombre(), usuario.getCorreo(), usuario.getRol().name(), cambiarPass);
    }

    @Transactional
    public TokenResponse firstLogin(FirstLoginRequest request) {
        Usuario usuario = usuarioRepository.findByCorreo(request.correo())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        TokenUsuario tokenUsuario = usuario.getTokenUsuario();
        if (tokenUsuario == null || tokenUsuario.getContrasenaTemporal() == null) {
            throw new InvalidOperationException("No tiene una contraseña temporal asignada");
        }

        if (!passwordEncoder.matches(request.passwordTemporal(), tokenUsuario.getContrasenaTemporal())) {
            throw new InvalidOperationException("Contraseña temporal incorrecta");
        }

        // Actualizar password y limpiar cambiarPass
        usuario.setPassword(passwordEncoder.encode(request.nuevaPassword()));
        tokenUsuario.setContrasenaTemporal(null);
        tokenUsuario.setCambiarPass(false);
        usuarioRepository.save(usuario);

        // Generar token JWT
        String jwt = tokenProvider.generateTokenFromUsername(usuario.getCorreo(), usuario.getRol().name(), usuario.getId());

        return new TokenResponse(jwt, tokenProvider.getJwtExpirationInMs(),
            usuario.getId(), usuario.getNombre(), usuario.getCorreo(), usuario.getRol().name(), false);
    }

    @Transactional
    public void resetPassword(String correo, String nuevaPassword) {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (nuevaPassword == null || nuevaPassword.length() < 6) {
            throw new InvalidOperationException("La contraseña debe tener al menos 6 caracteres");
        }

        // Actualizar password y limpiar flag cambiarPass
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        if (usuario.getTokenUsuario() != null) {
            usuario.getTokenUsuario().setCambiarPass(false);
        }
        usuarioRepository.save(usuario);
    }
}
