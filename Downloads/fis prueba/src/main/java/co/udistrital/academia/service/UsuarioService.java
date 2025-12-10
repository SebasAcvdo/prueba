package co.udistrital.academia.service;

import co.udistrital.academia.dto.EstadoUsuarioRequest;
import co.udistrital.academia.dto.UsuarioRequest;
import co.udistrital.academia.dto.UsuarioResponse;
import co.udistrital.academia.dto.UsuarioUpdateRequest;
import co.udistrital.academia.entity.TokenUsuario;
import co.udistrital.academia.entity.Usuario;
import co.udistrital.academia.exception.InvalidOperationException;
import co.udistrital.academia.exception.ResourceNotFoundException;
import co.udistrital.academia.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public Page<UsuarioResponse> listarUsuarios(Pageable pageable) {
        return usuarioRepository.findAll(pageable)
                .map(this::toResponse);
    }

    @Transactional
    public UsuarioResponse crearUsuario(UsuarioRequest request) {
        if (usuarioRepository.existsByCorreo(request.correo())) {
            throw new InvalidOperationException("Ya existe un usuario con ese correo");
        }

        String usuarioTemporal = "user" + UUID.randomUUID().toString().substring(0, 8);
        String passwordTemporal = UUID.randomUUID().toString().substring(0, 12);

        TokenUsuario tokenUsuario = TokenUsuario.builder()
                .usuarioTemporal(usuarioTemporal)
                .contrasenaTemporal(passwordEncoder.encode(passwordTemporal))
                .build();

        Usuario usuario = Usuario.builder()
                .nombre(request.nombre())
                .correo(request.correo())
                .password(passwordEncoder.encode(passwordTemporal))
                .rol(Usuario.Rol.valueOf(request.rol().toUpperCase()))
                .estado(true)
                .tokenUsuario(tokenUsuario)
                .build();

        usuario = usuarioRepository.save(usuario);

        return toResponseWithCredentials(usuario, usuarioTemporal, passwordTemporal);
    }

    @Transactional
    public UsuarioResponse actualizarUsuario(Long id, UsuarioUpdateRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        usuario.setNombre(request.nombre());
        if (request.correo() != null && !request.correo().equals(usuario.getCorreo())) {
            if (usuarioRepository.existsByCorreo(request.correo())) {
                throw new InvalidOperationException("Ya existe un usuario con ese correo");
            }
            usuario.setCorreo(request.correo());
        }

        usuario = usuarioRepository.save(usuario);
        return toResponse(usuario);
    }

    @Transactional
    public UsuarioResponse cambiarEstado(Long id, Boolean nuevoEstado) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        usuario.setEstado(nuevoEstado);
        usuario = usuarioRepository.save(usuario);
        return toResponse(usuario);
    }

    private UsuarioResponse toResponse(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getCorreo(),
                usuario.getRol().name(),
                usuario.getEstado(),
                null,
                null
        );
    }

    private UsuarioResponse toResponseWithCredentials(Usuario usuario, String usuarioTemporal, String passwordTemporal) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getCorreo(),
                usuario.getRol().name(),
                usuario.getEstado(),
                usuarioTemporal,
                passwordTemporal
        );
    }
}
