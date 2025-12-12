package co.udistrital.academia.service;

import co.udistrital.academia.entity.Estudiante;
import co.udistrital.academia.entity.Usuario;
import co.udistrital.academia.exception.ResourceNotFoundException;
import co.udistrital.academia.repository.EstudianteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EstudianteService {

    @Autowired
    private EstudianteRepository estudianteRepository;

    public List<Estudiante> listarEstudiantes(Long acudienteId) {
        if (acudienteId != null) {
            // Filtrar por acudiente
            return estudianteRepository.findAll().stream()
                .filter(e -> e.getAcudiente() != null && e.getAcudiente().getId().equals(acudienteId))
                .toList();
        }
        return estudianteRepository.findAll();
    }

    public Estudiante obtenerPorId(Long id) {
        return estudianteRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado con id: " + id));
    }

    public void quitarDeGrupo(Long estudianteId) {
        Estudiante estudiante = obtenerPorId(estudianteId);
        estudiante.setGrupo(null);
        estudianteRepository.save(estudiante);
    }
}
