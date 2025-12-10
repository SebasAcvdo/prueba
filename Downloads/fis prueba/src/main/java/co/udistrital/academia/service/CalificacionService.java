package co.udistrital.academia.service;

import co.udistrital.academia.dto.CalificacionRequest;
import co.udistrital.academia.dto.CalificacionResponse;
import co.udistrital.academia.dto.EstudianteSimpleResponse;
import co.udistrital.academia.dto.LogroResponse;
import co.udistrital.academia.entity.Calificacion;
import co.udistrital.academia.entity.Estudiante;
import co.udistrital.academia.entity.Logro;
import co.udistrital.academia.entity.Usuario;
import co.udistrital.academia.exception.InvalidOperationException;
import co.udistrital.academia.exception.ResourceNotFoundException;
import co.udistrital.academia.repository.CalificacionRepository;
import co.udistrital.academia.repository.EstudianteRepository;
import co.udistrital.academia.repository.LogroRepository;
import co.udistrital.academia.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CalificacionService {

    @Autowired
    private CalificacionRepository calificacionRepository;

    @Autowired
    private LogroRepository logroRepository;

    @Autowired
    private EstudianteRepository estudianteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public CalificacionResponse crearCalificacion(CalificacionRequest request) {
        Logro logro = logroRepository.findById(request.logroId())
                .orElseThrow(() -> new ResourceNotFoundException("Logro no encontrado"));

        Estudiante estudiante = estudianteRepository.findById(request.estudianteId())
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado"));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario profesor = usuarioRepository.findByCorreo(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Profesor no encontrado"));

        if (!profesor.getRol().equals(Usuario.Rol.PROFESOR)) {
            throw new InvalidOperationException("Solo los profesores pueden crear calificaciones");
        }

        if (request.valor() < 1.0 || request.valor() > 5.0) {
            throw new InvalidOperationException("La calificación debe estar entre 1.0 y 5.0");
        }

        Calificacion calificacion = Calificacion.builder()
                .valor(request.valor())
                .periodo(request.periodo())
                .logro(logro)
                .estudiante(estudiante)
                .profesor(profesor)
                .build();

        calificacion = calificacionRepository.save(calificacion);
        return toResponse(calificacion);
    }

    @Transactional
    public CalificacionResponse actualizarCalificacion(Long id, CalificacionRequest request) {
        Calificacion calificacion = calificacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Calificación no encontrada"));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario profesor = usuarioRepository.findByCorreo(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Profesor no encontrado"));

        if (!calificacion.getProfesor().getId().equals(profesor.getId())) {
            throw new InvalidOperationException("Solo puede modificar sus propias calificaciones");
        }

        if (request.valor() < 1.0 || request.valor() > 5.0) {
            throw new InvalidOperationException("La calificación debe estar entre 1.0 y 5.0");
        }

        calificacion.setValor(request.valor());
        calificacion.setPeriodo(request.periodo());

        calificacion = calificacionRepository.save(calificacion);
        return toResponse(calificacion);
    }

    @Transactional(readOnly = true)
    public List<CalificacionResponse> consultarCalificaciones(Long estudianteId, Integer periodo) {
        List<Calificacion> calificaciones;

        if (periodo != null) {
            calificaciones = calificacionRepository.findByEstudianteIdAndPeriodo(estudianteId, periodo);
        } else {
            calificaciones = calificacionRepository.findByEstudianteId(estudianteId);
        }

        return calificaciones.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private CalificacionResponse toResponse(Calificacion calificacion) {
        LogroResponse logroResponse = new LogroResponse(
                calificacion.getLogro().getId(),
                calificacion.getLogro().getNombre(),
                calificacion.getLogro().getDescripcion(),
                calificacion.getLogro().getCategoria().name(),
                calificacion.getLogro().getEstado().name()
        );

        EstudianteSimpleResponse estudianteResponse = new EstudianteSimpleResponse(
                calificacion.getEstudiante().getId(),
                calificacion.getEstudiante().getNombre(),
                calificacion.getEstudiante().getApellido(),
                calificacion.getEstudiante().getGrado(),
                calificacion.getEstudiante().getRegCivil(),
                calificacion.getEstudiante().getEstado().name()
        );

        return new CalificacionResponse(
                calificacion.getId(),
                calificacion.getValor(),
                calificacion.getPeriodo(),
                logroResponse,
                estudianteResponse,
                calificacion.getProfesor().getNombre()
        );
    }
}
