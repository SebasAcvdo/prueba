package co.udistrital.academia.service;

import co.udistrital.academia.dto.*;
import co.udistrital.academia.entity.Aspirante;
import co.udistrital.academia.entity.FormularioPreinscripcion;
import co.udistrital.academia.entity.Usuario;
import co.udistrital.academia.exception.ResourceNotFoundException;
import co.udistrital.academia.repository.AspiranteRepository;
import co.udistrital.academia.repository.FormularioPreinscripcionRepository;
import co.udistrital.academia.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FormularioPreinscripcionService {

    @Autowired
    private FormularioPreinscripcionRepository formularioRepository;

    @Autowired
    private AspiranteRepository aspiranteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Guarda o actualiza el formulario de pre-inscripción
     * Actualiza el estado del aspirante a SIN_REVISAR
     * Actualiza el nombre del usuario con los datos del acudiente
     */
    @Transactional
    public EstadoPreinscripcionResponse guardarFormulario(Long aspiranteId, FormularioPreinscripcionRequest request) {
        Aspirante aspirante = aspiranteRepository.findById(aspiranteId)
                .orElseThrow(() -> new ResourceNotFoundException("Aspirante no encontrado con id: " + aspiranteId));

        // Buscar formulario existente o crear nuevo
        FormularioPreinscripcion formulario = formularioRepository.findByAspiranteId(aspiranteId)
                .orElse(FormularioPreinscripcion.builder()
                        .aspirante(aspirante)
                        .build());

        // Actualizar datos del acudiente
        AcudienteFormDTO acudiente = request.getAcudiente();
        formulario.setAcudienteNombre(acudiente.getNombre());
        formulario.setAcudienteApellido(acudiente.getApellido());
        formulario.setAcudienteTelefono(acudiente.getTelefono());
        formulario.setAcudienteCorreo(acudiente.getCorreo());

        // Actualizar datos del estudiante
        EstudianteFormDTO estudiante = request.getEstudiante();
        formulario.setEstudianteNombre(estudiante.getNombre());
        formulario.setEstudianteApellido(estudiante.getApellido());
        formulario.setGradoAspirado(estudiante.getGradoAspirado());
        formulario.setFechaNacimiento(estudiante.getFechaNacimiento());
        formulario.setRegistroCivil(estudiante.getRegistroCivil());

        // Actualizar información médica
        if (request.getMedico() != null) {
            InformacionMedicaDTO medico = request.getMedico();
            formulario.setAlergias(medico.getAlergias());
            formulario.setCondicionesMedicas(medico.getCondicionesMedicas());
            formulario.setMedicamentos(medico.getMedicamentos());
        }

        // Guardar formulario
        formularioRepository.save(formulario);

        // Actualizar estado del aspirante a SIN_REVISAR
        aspirante.setEstadoInscripcion(Aspirante.EstadoInscripcion.SIN_REVISAR);
        aspiranteRepository.save(aspirante);

        // Actualizar nombre del usuario con nombre completo del acudiente
        Usuario usuario = aspirante.getUsuario();
        usuario.setNombre(acudiente.getNombre() + " " + acudiente.getApellido());
        usuarioRepository.save(usuario);

        return EstadoPreinscripcionResponse.builder()
                .estado(aspirante.getEstadoInscripcion().toString())
                .fechaEntrevista(aspirante.getFechaEntrevista())
                .build();
    }
}
