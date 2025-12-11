package co.udistrital.academia.service;

import co.udistrital.academia.dto.CitacionRequest;
import co.udistrital.academia.dto.CitacionResponse;
import co.udistrital.academia.entity.Aspirante;
import co.udistrital.academia.entity.Citacion;
import co.udistrital.academia.entity.Usuario;
import co.udistrital.academia.exception.InvalidOperationException;
import co.udistrital.academia.exception.ResourceNotFoundException;
import co.udistrital.academia.repository.AspiranteRepository;
import co.udistrital.academia.repository.CitacionRepository;
import co.udistrital.academia.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CitacionService {

    @Autowired
    private CitacionRepository citacionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AspiranteRepository aspiranteRepository;

    @Transactional
    public CitacionResponse crearCitacion(CitacionRequest request) {
        Citacion.TipoCitacion tipo;
        try {
            tipo = Citacion.TipoCitacion.valueOf(request.tipo().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidOperationException("Tipo de citación inválido: " + request.tipo());
        }

        Citacion citacion = Citacion.builder()
                .tipo(tipo)
                .fecha(request.fecha())
                .motivo(request.motivo())
                .estadoCita(Citacion.EstadoCita.PENDIENTE)
                .build();

        // Validaciones según tipo
        switch (tipo) {
            case INDIVIDUAL:
                if (request.acudienteIds() == null || request.acudienteIds().size() != 1) {
                    throw new InvalidOperationException("Citación individual requiere 1 acudiente");
                }
                if (request.profesorIds() == null || request.profesorIds().size() != 1) {
                    throw new InvalidOperationException("Citación individual requiere 1 profesor");
                }
                break;
            case GRUPAL:
                if (request.acudienteIds() == null || request.acudienteIds().isEmpty()) {
                    throw new InvalidOperationException("Citación grupal requiere al menos 1 acudiente");
                }
                if (request.profesorIds() == null || request.profesorIds().size() != 1) {
                    throw new InvalidOperationException("Citación grupal requiere 1 profesor");
                }
                break;
            case ASPIRANTE:
                if (request.aspiranteIds() == null || request.aspiranteIds().size() != 1) {
                    throw new InvalidOperationException("Citación de aspirante requiere 1 aspirante");
                }
                break;
        }

        // Cargar acudientes
        if (request.acudienteIds() != null) {
            for (Long acudienteId : request.acudienteIds()) {
                Usuario acudiente = usuarioRepository.findById(acudienteId)
                        .orElseThrow(() -> new ResourceNotFoundException("Acudiente no encontrado: " + acudienteId));
                citacion.getAcudientes().add(acudiente);
            }
        }

        // Cargar profesores
        if (request.profesorIds() != null) {
            for (Long profesorId : request.profesorIds()) {
                Usuario profesor = usuarioRepository.findById(profesorId)
                        .orElseThrow(() -> new ResourceNotFoundException("Profesor no encontrado: " + profesorId));
                citacion.getProfesores().add(profesor);
            }
        }

        // Cargar aspirantes
        if (request.aspiranteIds() != null) {
            for (Long aspiranteId : request.aspiranteIds()) {
                Aspirante aspirante = aspiranteRepository.findById(aspiranteId)
                        .orElseThrow(() -> new ResourceNotFoundException("Aspirante no encontrado: " + aspiranteId));
                citacion.getAspirantes().add(aspirante);
            }
        }

        citacion = citacionRepository.save(citacion);
        return toResponse(citacion);
    }

    @Transactional(readOnly = true)
    public List<CitacionResponse> listarPorTipo(String tipo) {
        Citacion.TipoCitacion tipoCitacion;
        try {
            tipoCitacion = Citacion.TipoCitacion.valueOf(tipo.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidOperationException("Tipo de citación inválido: " + tipo);
        }

        return citacionRepository.findByTipo(tipoCitacion).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CitacionResponse> listarCitaciones(String tipo, Long profesorId, Long acudienteId) {
        List<Citacion> citaciones = citacionRepository.findAll();

        // Filtrar por tipo si se proporciona
        if (tipo != null && !tipo.isEmpty()) {
            try {
                Citacion.TipoCitacion tipoCitacion = Citacion.TipoCitacion.valueOf(tipo.toUpperCase());
                citaciones = citaciones.stream()
                    .filter(c -> c.getTipo().equals(tipoCitacion))
                    .collect(Collectors.toList());
            } catch (IllegalArgumentException e) {
                throw new InvalidOperationException("Tipo de citación inválido: " + tipo);
            }
        }

        // Filtrar por profesor si se proporciona
        if (profesorId != null) {
            citaciones = citaciones.stream()
                .filter(c -> c.getProfesores().stream()
                    .anyMatch(p -> p.getId().equals(profesorId)))
                .collect(Collectors.toList());
        }

        // Filtrar por acudiente si se proporciona
        if (acudienteId != null) {
            citaciones = citaciones.stream()
                .filter(c -> c.getAcudientes().stream()
                    .anyMatch(a -> a.getId().equals(acudienteId)))
                .collect(Collectors.toList());
        }

        return citaciones.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<CitacionResponse> listarCitacionesPaginadas(Pageable pageable, String tipo, String estado) {
        Page<Citacion> citaciones;

        if (tipo != null && !tipo.isEmpty() && estado != null && !estado.isEmpty()) {
            try {
                Citacion.TipoCitacion tipoEnum = Citacion.TipoCitacion.valueOf(tipo.toUpperCase());
                Citacion.EstadoCita estadoEnum = Citacion.EstadoCita.valueOf(estado.toUpperCase());
                citaciones = citacionRepository.findByTipoAndEstadoCita(tipoEnum, estadoEnum, pageable);
            } catch (IllegalArgumentException e) {
                throw new InvalidOperationException("Tipo o estado inválido");
            }
        } else if (tipo != null && !tipo.isEmpty()) {
            try {
                Citacion.TipoCitacion tipoEnum = Citacion.TipoCitacion.valueOf(tipo.toUpperCase());
                citaciones = citacionRepository.findByTipo(tipoEnum, pageable);
            } catch (IllegalArgumentException e) {
                throw new InvalidOperationException("Tipo de citación inválido: " + tipo);
            }
        } else if (estado != null && !estado.isEmpty()) {
            try {
                Citacion.EstadoCita estadoEnum = Citacion.EstadoCita.valueOf(estado.toUpperCase());
                citaciones = citacionRepository.findByEstadoCita(estadoEnum, pageable);
            } catch (IllegalArgumentException e) {
                throw new InvalidOperationException("Estado inválido: " + estado);
            }
        } else {
            citaciones = citacionRepository.findAll(pageable);
        }

        return citaciones.map(this::toResponse);
    }

    @Transactional
    public CitacionResponse cambiarEstado(Long id, String nuevoEstado) {
        Citacion citacion = citacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Citación no encontrada"));

        try {
            Citacion.EstadoCita estado = Citacion.EstadoCita.valueOf(nuevoEstado.toUpperCase());
            citacion.setEstadoCita(estado);
        } catch (IllegalArgumentException e) {
            throw new InvalidOperationException("Estado inválido: " + nuevoEstado);
        }

        citacion = citacionRepository.save(citacion);
        return toResponse(citacion);
    }

    private CitacionResponse toResponse(Citacion citacion) {
        List<co.udistrital.academia.dto.UsuarioSimpleDTO> acudientes = citacion.getAcudientes().stream()
                .map(u -> new co.udistrital.academia.dto.UsuarioSimpleDTO(u.getId(), u.getNombre(), u.getCorreo()))
                .collect(Collectors.toList());

        List<co.udistrital.academia.dto.UsuarioSimpleDTO> profesores = citacion.getProfesores().stream()
                .map(u -> new co.udistrital.academia.dto.UsuarioSimpleDTO(u.getId(), u.getNombre(), u.getCorreo()))
                .collect(Collectors.toList());

        List<co.udistrital.academia.dto.AspiranteSimpleDTO> aspirantes = citacion.getAspirantes().stream()
                .map(a -> new co.udistrital.academia.dto.AspiranteSimpleDTO(
                    a.getId(), 
                    a.getUsuario() != null ? a.getUsuario().getNombre() : "Sin nombre",
                    a.getUsuario() != null ? a.getUsuario().getCorreo() : "Sin correo"
                ))
                .collect(Collectors.toList());

        return new CitacionResponse(
                citacion.getId(),
                citacion.getTipo().name(),
                citacion.getFecha(),
                citacion.getMotivo(),
                citacion.getEstadoCita().name(),
                acudientes,
                profesores,
                aspirantes
        );
    }
}
