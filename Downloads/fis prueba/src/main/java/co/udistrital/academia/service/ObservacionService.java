package co.udistrital.academia.service;

import co.udistrital.academia.dto.ObservacionRequest;
import co.udistrital.academia.entity.Estudiante;
import co.udistrital.academia.entity.Observacion;
import co.udistrital.academia.entity.Usuario;
import co.udistrital.academia.exception.ResourceNotFoundException;
import co.udistrital.academia.repository.EstudianteRepository;
import co.udistrital.academia.repository.ObservacionRepository;
import co.udistrital.academia.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ObservacionService {
    
    @Autowired
    private ObservacionRepository observacionRepository;
    
    @Autowired
    private EstudianteRepository estudianteRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Transactional(readOnly = true)
    public List<Observacion> listarPorEstudiante(Long estudianteId) {
        return observacionRepository.findByEstudianteIdOrderByFechaDesc(estudianteId);
    }
    
    @Transactional(readOnly = true)
    public List<Observacion> listarPorProfesor(Long profesorId) {
        return observacionRepository.findByProfesorIdOrderByFechaDesc(profesorId);
    }
    
    @Transactional
    public Observacion crearObservacion(ObservacionRequest request, Long profesorId) {
        Estudiante estudiante = estudianteRepository.findById(request.estudianteId())
            .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado"));
        
        Usuario profesor = usuarioRepository.findById(profesorId)
            .orElseThrow(() -> new ResourceNotFoundException("Profesor no encontrado"));
        
        Observacion observacion = Observacion.builder()
            .fecha(request.fecha())
            .descripcion(request.descripcion())
            .tipo(request.tipo())
            .estudiante(estudiante)
            .profesor(profesor)
            .build();
        
        return observacionRepository.save(observacion);
    }
}
