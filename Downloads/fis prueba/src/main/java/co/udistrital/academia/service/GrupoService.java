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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
public class GrupoService {

    @Autowired
    private GrupoRepository grupoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EstudianteRepository estudianteRepository;

    @Transactional
    public Grupo crearGrupo(GrupoRequest request) {
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
        return grupo;
    }

    public List<GrupoResponse> listarGrupos(Long profesorId) {
        List<Grupo> grupos;
        if (profesorId != null) {
            grupos = grupoRepository.findAll().stream()
                .filter(g -> g.getProfesor() != null && g.getProfesor().getId().equals(profesorId))
                .toList();
        } else {
            grupos = grupoRepository.findAll();
        }
        return grupos.stream().map(this::convertirAGrupoResponse).toList();
    }

    private GrupoResponse convertirAGrupoResponse(Grupo grupo) {
        return new GrupoResponse(
            grupo.getId(),
            grupo.getNombre(),
            grupo.getGrado(),
            grupo.getCapacidad(),
            grupo.getEstado().name(),
            grupo.getProfesor() != null ? grupo.getProfesor().getNombre() : null,
            grupo.getEstudiantes() != null ? grupo.getEstudiantes().size() : 0,
            grupo.getEstudiantes() != null 
                ? grupo.getEstudiantes().stream()
                    .map(e -> new EstudianteSimpleResponse(
                        e.getId(), 
                        e.getNombre(), 
                        e.getApellido(),
                        e.getGrado() != null ? e.getGrado() : "",
                        e.getRegCivil() != null ? e.getRegCivil() : "",
                        e.getEstado() != null ? e.getEstado().name() : ""
                    ))
                    .toList()
                : List.of()
        );
    }

    @Transactional
    public Grupo confirmarGrupo(Long id) {
        Grupo grupo = grupoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado"));

        if (grupo.getEstudiantes().isEmpty()) {
            throw new InvalidOperationException("No se puede confirmar un grupo sin estudiantes");
        }

        grupo.setEstado(Grupo.EstadoGrupo.ACTIVO);
        return grupoRepository.save(grupo);
    }

    @Transactional(readOnly = true)
    public List<Grupo> listarGrupos() {
        return grupoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Page<Grupo> listarGruposPaginados(Pageable pageable, String estado) {
        if (estado != null && !estado.isEmpty()) {
            try {
                Grupo.EstadoGrupo estadoEnum = Grupo.EstadoGrupo.valueOf(estado.toUpperCase());
                return grupoRepository.findByEstado(estadoEnum, pageable);
            } catch (IllegalArgumentException e) {
                throw new InvalidOperationException("Estado inválido: " + estado);
            }
        }
        return grupoRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Grupo obtenerGrupo(Long id) {
        return grupoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado"));
    }

    @Transactional
    public void eliminarGrupo(Long id) {
        Grupo grupo = grupoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado"));
        
        // Desasignar estudiantes del grupo
        grupo.getEstudiantes().forEach(estudiante -> {
            estudiante.setGrupo(null);
            estudianteRepository.save(estudiante);
        });
        
        // Borrado lógico: cambiar estado a BORRADOR (inactivo)
        grupo.setEstado(Grupo.EstadoGrupo.BORRADOR);
        grupoRepository.save(grupo);
    }

    @Transactional
    public Grupo asignarEstudiantes(Long grupoId, List<Long> estudianteIds) {
        Grupo grupo = grupoRepository.findById(grupoId)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado"));

        if (estudianteIds.size() > grupo.getCapacidad()) {
            throw new InvalidOperationException(
                "No se pueden asignar " + estudianteIds.size() + 
                " estudiantes. Capacidad máxima: " + grupo.getCapacidad()
            );
        }

        // Desasignar estudiantes actuales que no están en la nueva lista
        grupo.getEstudiantes().forEach(estudiante -> {
            if (!estudianteIds.contains(estudiante.getId())) {
                estudiante.setGrupo(null);
                estudianteRepository.save(estudiante);
            }
        });

        // Asignar nuevos estudiantes
        for (Long estudianteId : estudianteIds) {
            Estudiante estudiante = estudianteRepository.findById(estudianteId)
                    .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado con ID: " + estudianteId));
            
            estudiante.setGrupo(grupo);
            estudianteRepository.save(estudiante);
        }

        return grupoRepository.findById(grupoId).orElseThrow();
    }

    @Transactional
    public Grupo agregarEstudiante(Long grupoId, Long estudianteId) {
        Grupo grupo = grupoRepository.findById(grupoId)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado"));

        // Verificar capacidad
        long estudiantesActuales = estudianteRepository.findAll().stream()
                .filter(e -> e.getGrupo() != null && e.getGrupo().getId().equals(grupoId))
                .count();

        if (estudiantesActuales >= grupo.getCapacidad()) {
            throw new InvalidOperationException(
                "El grupo está lleno. Capacidad máxima: " + grupo.getCapacidad()
            );
        }

        Estudiante estudiante = estudianteRepository.findById(estudianteId)
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado"));

        // Si el estudiante ya está en otro grupo, quitarlo primero
        if (estudiante.getGrupo() != null) {
            throw new InvalidOperationException(
                "El estudiante ya está asignado al grupo: " + estudiante.getGrupo().getNombre()
            );
        }

        estudiante.setGrupo(grupo);
        estudianteRepository.save(estudiante);

        return grupoRepository.findById(grupoId).orElseThrow();
    }
}

