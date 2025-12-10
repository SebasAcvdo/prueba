package co.udistrital.academia.service;

import co.udistrital.academia.entity.Calificacion;
import co.udistrital.academia.entity.Estudiante;
import co.udistrital.academia.entity.Grupo;
import co.udistrital.academia.exception.ResourceNotFoundException;
import co.udistrital.academia.repository.CalificacionRepository;
import co.udistrital.academia.repository.EstudianteRepository;
import co.udistrital.academia.repository.GrupoRepository;
import co.udistrital.academia.util.PdfGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReporteService {

    @Autowired
    private GrupoRepository grupoRepository;

    @Autowired
    private EstudianteRepository estudianteRepository;

    @Autowired
    private CalificacionRepository calificacionRepository;

    @Autowired
    private PdfGenerator pdfGenerator;

    @Transactional(readOnly = true)
    public byte[] generarListadoGrupo(Long grupoId) {
        Grupo grupo = grupoRepository.findById(grupoId)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado"));

        return pdfGenerator.generarListadoGrupo(grupo);
    }

    @Transactional(readOnly = true)
    public byte[] generarBoletin(Long estudianteId, Integer periodo) {
        Estudiante estudiante = estudianteRepository.findById(estudianteId)
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado"));

        List<Calificacion> calificaciones;
        if (periodo != null) {
            calificaciones = calificacionRepository.findByEstudianteIdAndPeriodo(estudianteId, periodo);
        } else {
            calificaciones = calificacionRepository.findByEstudianteId(estudianteId);
        }

        return pdfGenerator.generarBoletin(estudiante, calificaciones, periodo);
    }
}
