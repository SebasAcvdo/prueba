package co.udistrital.academia.service;

import co.udistrital.academia.dto.EstudianteSimpleResponse;
import co.udistrital.academia.dto.GrupoRequest;
import co.udistrital.academia.dto.GrupoResponse;
import co.udistrital.academia.entity.Estudiante;
import co.udistrital.academia.entity.Grupo;
import co.udistrital.academia.entity.Usuario;
import co.udistrital.academia.exception.InvalidOperationException;
import co.udistrital.academia.exception.ResourceNotFoundException;
import co.udistrital.academia.repository.EstudianteRepository;
import co.udistrital.academia.repository.GrupoRepository;
import co.udistrital.academia.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GrupoService {

    @Autowired
    private GrupoRepository grupoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EstudianteRepository estudianteRepository;

    @Transactional
    public GrupoResponse crearGrupo(GrupoRequest request) {
        Usuario profesor = usuarioRepository.findById(request.profesorId())
                .orElseThrow(() -> new ResourceNotFoundException("Profesor no encontrado"));

        if (!profesor.getRol().equals(Usuario.Rol.PROFESOR)) {
            throw new InvalidOperationException("El usuario debe tener rol PROFESOR");
        }

        Grupo grupo = Grupo.builder()
                .nombre(request.nombre())
                .grado(request.grado())
                .capacidad(request.capacidad())
                .estado(Grupo.EstadoGrupo.BORRADOR)
                .profesor(profesor)
                .build();

        grupo = grupoRepository.save(grupo);
        return toResponse(grupo);
    }

    @Transactional
    public GrupoResponse confirmarGrupo(Long id) {
        Grupo grupo = grupoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado"));

        if (grupo.getEstudiantes().isEmpty()) {
            throw new InvalidOperationException("No se puede confirmar un grupo sin estudiantes");
        }

        grupo.setEstado(Grupo.EstadoGrupo.ACTIVO);
        grupo = grupoRepository.save(grupo);
        return toResponse(grupo);
    }

    @Transactional(readOnly = true)
    public List<GrupoResponse> listarGrupos() {
        return grupoRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GrupoResponse obtenerGrupo(Long id) {
        Grupo grupo = grupoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado"));
        return toResponse(grupo);
    }

    @Transactional
    public GrupoResponse agregarEstudiante(Long grupoId, Long estudianteId) {
        Grupo grupo = grupoRepository.findById(grupoId)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado"));

        if (grupo.getEstudiantes().size() >= grupo.getCapacidad()) {
            throw new InvalidOperationException("El grupo ha alcanzado su capacidad máxima de " + grupo.getCapacidad());
        }

        Estudiante estudiante = estudianteRepository.findById(estudianteId)
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado"));

        if (estudiante.getGrupo() != null) {
            throw new InvalidOperationException("El estudiante ya pertenece a un grupo");
        }

        estudiante.setGrupo(grupo);
        estudianteRepository.save(estudiante);

        return toResponse(grupo);
    }

    private GrupoResponse toResponse(Grupo grupo) {
        List<EstudianteSimpleResponse> estudiantes = grupo.getEstudiantes().stream()
                .map(e -> new EstudianteSimpleResponse(
                        e.getId(), e.getNombre(), e.getApellido(), e.getGrado(),
                        e.getRegCivil(), e.getEstado().name()))
                .collect(Collectors.toList());

        return new GrupoResponse(
                grupo.getId(),
                grupo.getNombre(),
                grupo.getGrado(),
                grupo.getCapacidad(),
                grupo.getEstado().name(),
                grupo.getProfesor().getNombre(),
                grupo.getEstudiantes().size(),
                estudiantes
        );
    }
}
