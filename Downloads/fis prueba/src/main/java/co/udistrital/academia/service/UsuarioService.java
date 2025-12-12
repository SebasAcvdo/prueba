package co.udistrital.academia.service;

import co.udistrital.academia.dto.CredencialesTemporalesDto;
import co.udistrital.academia.dto.UsuarioRequest;
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
    public Page<Usuario> listarUsuarios(Pageable pageable) {
        return usuarioRepository.findAll(pageable);
    }

    @Transactional
    public CredencialesTemporalesDto crearUsuario(UsuarioRequest request) {
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

        return new CredencialesTemporalesDto(usuario.getId(), usuarioTemporal, passwordTemporal);
    }

    @Transactional
    public Usuario actualizarUsuario(Long id, UsuarioUpdateRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        usuario.setNombre(request.nombre());
        if (request.correo() != null && !request.correo().equals(usuario.getCorreo())) {
            if (usuarioRepository.existsByCorreo(request.correo())) {
                throw new InvalidOperationException("Ya existe un usuario con ese correo");
            }
            usuario.setCorreo(request.correo());
        }

        return usuarioRepository.save(usuario);
    }

    @Transactional
    public Usuario cambiarEstado(Long id, Boolean nuevoEstado) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        usuario.setEstado(nuevoEstado);
        return usuarioRepository.save(usuario);
    }
}
