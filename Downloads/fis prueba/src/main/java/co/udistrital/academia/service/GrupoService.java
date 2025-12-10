package co.udistrital.academia.service;

import co.udistrital.academia.dto.GrupoRequest;
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
    public Grupo agregarEstudiante(Long grupoId, Long estudianteId) {
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

        return grupo;
    }
}

