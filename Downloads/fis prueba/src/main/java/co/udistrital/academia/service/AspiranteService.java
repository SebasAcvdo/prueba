package co.udistrital.academia.service;

import co.udistrital.academia.dto.AspiranteCreateRequest;
import co.udistrital.academia.dto.AspiranteResponse;
import co.udistrital.academia.dto.EstudianteSimpleResponse;
import co.udistrital.academia.dto.UsuarioResponse;
import co.udistrital.academia.entity.Aspirante;
import co.udistrital.academia.entity.Estudiante;
import co.udistrital.academia.entity.Usuario;
import co.udistrital.academia.exception.InvalidOperationException;
import co.udistrital.academia.exception.ResourceNotFoundException;
import co.udistrital.academia.repository.AspiranteRepository;
import co.udistrital.academia.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AspiranteService {

    @Autowired
    private AspiranteRepository aspiranteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public AspiranteResponse crearAspirante(AspiranteCreateRequest request) {
        if (request.estudiantes() == null || request.estudiantes().isEmpty()) {
            throw new InvalidOperationException("Debe incluir al menos un estudiante");
        }

        if (usuarioRepository.existsByCorreo(request.correo())) {
            throw new InvalidOperationException("Ya existe un usuario con ese correo");
        }

        String passwordTemporal = UUID.randomUUID().toString().substring(0, 12);

        Usuario usuario = Usuario.builder()
                .nombre(request.nombreUsuario())
                .correo(request.correo())
                .password(passwordEncoder.encode(passwordTemporal))
                .rol(Usuario.Rol.ASPIRANTE)
                .estado(true)
                .build();

        usuario = usuarioRepository.save(usuario);

        Aspirante aspirante = Aspirante.builder()
                .estadoInscripcion(Aspirante.EstadoInscripcion.SIN_REVISAR)
                .usuario(usuario)
                .build();

        aspirante = aspiranteRepository.save(aspirante);

        // Crear estudiantes
        for (AspiranteCreateRequest.EstudianteData estudianteData : request.estudiantes()) {
            Estudiante estudiante = Estudiante.builder()
                    .nombre(estudianteData.nombre())
                    .apellido(estudianteData.apellido())
                    .grado(estudianteData.grado())
                    .regCivil(estudianteData.regCivil())
                    .estado(Estudiante.EstadoEstudiante.ACTIVO)
                    .aspirante(aspirante)
                    .build();
            aspirante.getEstudiantes().add(estudiante);
        }

        aspirante = aspiranteRepository.save(aspirante);
        return toResponse(aspirante);
    }

    @Transactional
    public AspiranteResponse cambiarEstado(Long id, String nuevoEstado) {
        Aspirante aspirante = aspiranteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aspirante no encontrado"));

        try {
            Aspirante.EstadoInscripcion estado = Aspirante.EstadoInscripcion.valueOf(nuevoEstado.toUpperCase());
            aspirante.setEstadoInscripcion(estado);
        } catch (IllegalArgumentException e) {
            throw new InvalidOperationException("Estado inválido: " + nuevoEstado);
        }

        aspirante = aspiranteRepository.save(aspirante);
        return toResponse(aspirante);
    }

    @Transactional
    public AspiranteResponse agendarEntrevista(Long id, LocalDate fecha) {
        Aspirante aspirante = aspiranteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aspirante no encontrado"));

        aspirante.setEstadoInscripcion(Aspirante.EstadoInscripcion.ESPERA_ENTREVISTA);
        aspirante.setFechaEntrevista(fecha);

        aspirante = aspiranteRepository.save(aspirante);
        return toResponse(aspirante);
    }

    private AspiranteResponse toResponse(Aspirante aspirante) {
        UsuarioResponse usuarioResponse = new UsuarioResponse(
                aspirante.getUsuario().getId(),
                aspirante.getUsuario().getNombre(),
                aspirante.getUsuario().getCorreo(),
                aspirante.getUsuario().getRol().name(),
                aspirante.getUsuario().getEstado(),
                null, null
        );

        List<EstudianteSimpleResponse> estudiantes = aspirante.getEstudiantes().stream()
                .map(e -> new EstudianteSimpleResponse(
                        e.getId(), e.getNombre(), e.getApellido(), e.getGrado(),
                        e.getRegCivil(), e.getEstado().name()))
                .collect(Collectors.toList());

        return new AspiranteResponse(
                aspirante.getId(),
                aspirante.getEstadoInscripcion().name(),
                aspirante.getFechaEntrevista(),
                usuarioResponse,
                estudiantes
        );
    }
}
