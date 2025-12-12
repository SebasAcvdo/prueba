package co.udistrital.academia.service;

import co.udistrital.academia.dto.AspiranteCreateRequest;
import co.udistrital.academia.entity.Aspirante;
import co.udistrital.academia.entity.Estudiante;
import co.udistrital.academia.entity.Usuario;
import co.udistrital.academia.exception.InvalidOperationException;
import co.udistrital.academia.exception.ResourceNotFoundException;
import co.udistrital.academia.repository.AspiranteRepository;
import co.udistrital.academia.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AspiranteService {

    @Autowired
    private AspiranteRepository aspiranteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private co.udistrital.academia.repository.TokenUsuarioRepository tokenUsuarioRepository;

    @Autowired
    private co.udistrital.academia.repository.EstudianteRepository estudianteRepository;

    @Transactional
    public Aspirante crearAspirante(AspiranteCreateRequest request) {
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

        return aspiranteRepository.save(aspirante);
    }

    @Transactional
    public Aspirante cambiarEstado(Long id, String nuevoEstado) {
        Aspirante aspirante = aspiranteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aspirante no encontrado"));

        try {
            Aspirante.EstadoInscripcion estado = Aspirante.EstadoInscripcion.valueOf(nuevoEstado.toUpperCase());
            aspirante.setEstadoInscripcion(estado);
        } catch (IllegalArgumentException e) {
            throw new InvalidOperationException("Estado inválido: " + nuevoEstado);
        }

        return aspiranteRepository.save(aspirante);
    }

    @Transactional
    public Aspirante agendarEntrevista(Long id, LocalDate fecha) {
        Aspirante aspirante = aspiranteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aspirante no encontrado"));

        aspirante.setEstadoInscripcion(Aspirante.EstadoInscripcion.ESPERA_ENTREVISTA);
        aspirante.setFechaEntrevista(fecha);

        return aspiranteRepository.save(aspirante);
    }

    @Transactional(readOnly = true)
    public Page<Aspirante> listarAspirantes(Pageable pageable, String estado) {
        if (estado != null && !estado.isEmpty()) {
            try {
                Aspirante.EstadoInscripcion estadoEnum = Aspirante.EstadoInscripcion.valueOf(estado.toUpperCase());
                return aspiranteRepository.findByEstadoInscripcion(estadoEnum, pageable);
            } catch (IllegalArgumentException e) {
                throw new InvalidOperationException("Estado inválido: " + estado);
            }
        }
        return aspiranteRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public List<Aspirante> listarTodos() {
        return aspiranteRepository.findAll();
    }

    /**
     * Genera clave temporal para aspirante nuevo
     * Si el correo ya existe, retorna el aspirante existente
     * Si no existe, crea nuevo Usuario y Aspirante con clave temporal
     */
    @Transactional
    public co.udistrital.academia.dto.ClaveTemporalResponse solicitarClaveTemporal(String correo) {
        // Generar clave temporal alfanumérica de 6 caracteres
        String claveTemporal = generarClaveTemporal();
        
        // Verificar si ya existe un usuario con ese correo
        Usuario usuario = usuarioRepository.findByCorreo(correo).orElse(null);
        Aspirante aspirante;
        
        if (usuario != null) {
            // Usuario ya existe, actualizar su clave temporal
            if (usuario.getTokenUsuario() == null) {
                usuario.setTokenUsuario(new co.udistrital.academia.entity.TokenUsuario());
            }
            usuario.getTokenUsuario().setContrasenaTemporal(passwordEncoder.encode(claveTemporal));
            usuario.getTokenUsuario().setCambiarPass(true);
            usuario.setPassword(passwordEncoder.encode(claveTemporal));
            usuarioRepository.save(usuario);
            
            // Buscar o crear aspirante
            Optional<Aspirante> aspiranteOpt = aspiranteRepository.findByUsuarioId(usuario.getId());
            if (aspiranteOpt.isEmpty()) {
                Aspirante nuevoAspirante = Aspirante.builder()
                        .usuario(usuario)
                        .estadoInscripcion(Aspirante.EstadoInscripcion.SIN_REVISAR)
                        .build();
                aspirante = aspiranteRepository.save(nuevoAspirante);
            } else {
                aspirante = aspiranteOpt.get();
            }
        } else {
            // Crear nuevo usuario y aspirante
            co.udistrital.academia.entity.TokenUsuario token = co.udistrital.academia.entity.TokenUsuario.builder()
                    .contrasenaTemporal(passwordEncoder.encode(claveTemporal))
                    .cambiarPass(true)
                    .build();
            
            usuario = Usuario.builder()
                    .nombre("Aspirante")
                    .correo(correo)
                    .password(passwordEncoder.encode(claveTemporal))
                    .rol(Usuario.Rol.ASPIRANTE)
                    .estado(true)
                    .tokenUsuario(token)
                    .build();
            
            token.setUsuario(usuario);
            usuario = usuarioRepository.save(usuario);
            
            aspirante = Aspirante.builder()
                    .usuario(usuario)
                    .estadoInscripcion(Aspirante.EstadoInscripcion.SIN_REVISAR)
                    .build();
            aspirante = aspiranteRepository.save(aspirante);
        }
        
        return co.udistrital.academia.dto.ClaveTemporalResponse.builder()
                .claveTemporal(claveTemporal)
                .aspiranteId(aspirante.getId())
                .build();
    }

    /**
     * Genera una clave temporal alfanumérica de 6 caracteres
     */
    private String generarClaveTemporal() {
        return generarClaveTemporal(6);
    }

    /**
     * Genera una clave temporal alfanumérica de longitud especificada
     */
    private String generarClaveTemporal(int longitud) {
        String caracteres = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        StringBuilder clave = new StringBuilder();
        for (int i = 0; i < longitud; i++) {
            int index = (int) (Math.random() * caracteres.length());
            clave.append(caracteres.charAt(index));
        }
        return clave.toString();
    }

    /**
     * Obtiene datos del aspirante autenticado
     */
    @Transactional(readOnly = true)
    public co.udistrital.academia.dto.AspiranteMeResponse obtenerDatosAspirante(Long usuarioId) {
        System.out.println("=== obtenerDatosAspirante - usuarioId recibido: " + usuarioId);
        Aspirante aspirante = aspiranteRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Aspirante no encontrado"));
        
        System.out.println("=== Aspirante encontrado - ID: " + aspirante.getId());
        
        co.udistrital.academia.dto.AspiranteMeResponse response = co.udistrital.academia.dto.AspiranteMeResponse.builder()
                .id(aspirante.getId())
                .nombre(aspirante.getUsuario().getNombre())
                .correo(aspirante.getUsuario().getCorreo())
                .estado(aspirante.getEstadoInscripcion().toString())
                .build();
        
        System.out.println("=== Response creado - ID en response: " + response.getId());
        return response;
    }

    /**
     * Obtiene el estado de pre-inscripción del aspirante
     */
    @Transactional(readOnly = true)
    public co.udistrital.academia.dto.EstadoPreinscripcionResponse obtenerEstadoPreinscripcion(Long aspiranteId) {
        Aspirante aspirante = aspiranteRepository.findById(aspiranteId)
                .orElseThrow(() -> new ResourceNotFoundException("Aspirante no encontrado"));
        
        return co.udistrital.academia.dto.EstadoPreinscripcionResponse.builder()
                .estado(aspirante.getEstadoInscripcion().toString())
                .fechaEntrevista(aspirante.getFechaEntrevista())
                .build();
    }

    // ========== NUEVOS MÉTODOS - FLUJO SIMPLE ==========

    /**
     * Crea preinscripción pública: usuario aspirante + estudiante + clave temporal
     */
    @Transactional
    public co.udistrital.academia.dto.PreinscripcionPublicaResponse crearPreinscripcionPublica(
            co.udistrital.academia.dto.PreinscripcionPublicaRequest request) {
        
        // Validar que no exista usuario con ese correo
        if (usuarioRepository.existsByCorreo(request.getCorreo())) {
            throw new InvalidOperationException("Ya existe un usuario registrado con ese correo");
        }

        // Generar clave temporal (8 caracteres alfanuméricos)
        String claveTemporal = generarClaveTemporal(8);

        // Crear TokenUsuario
        co.udistrital.academia.entity.TokenUsuario tokenUsuario = co.udistrital.academia.entity.TokenUsuario.builder()
                .usuarioTemporal(request.getCorreo())
                .contrasenaTemporal(passwordEncoder.encode(claveTemporal))
                .cambiarPass(false) // No requiere cambio de contraseña
                .build();
        tokenUsuario = tokenUsuarioRepository.save(tokenUsuario);

        // Crear Usuario aspirante
        Usuario usuario = Usuario.builder()
                .nombre(request.getNombreAcudiente() + " " + request.getApellidoAcudiente())
                .correo(request.getCorreo())
                .password(passwordEncoder.encode(claveTemporal))
                .rol(Usuario.Rol.ASPIRANTE)
                .estado(true)
                .tokenUsuario(tokenUsuario)
                .build();
        usuario = usuarioRepository.save(usuario);

        // Crear Aspirante
        Aspirante aspirante = Aspirante.builder()
                .estadoInscripcion(Aspirante.EstadoInscripcion.SIN_REVISAR)
                .usuario(usuario)
                .build();
        aspirante = aspiranteRepository.save(aspirante);

        // Crear Estudiante vinculado
        Estudiante estudiante = Estudiante.builder()
                .nombre(request.getNombreMenor())
                .apellido(request.getApellidoMenor())
                .grado(request.getGrado())
                .regCivil(request.getAlergias()) // Guardar alergias en regCivil temporalmente
                .estado(Estudiante.EstadoEstudiante.ACTIVO)
                .aspirante(aspirante)
                .build();
        estudiante = estudianteRepository.save(estudiante);

        // Retornar respuesta
        return co.udistrital.academia.dto.PreinscripcionPublicaResponse.builder()
                .claveTemporal(claveTemporal)
                .aspiranteId(aspirante.getId())
                .estudianteId(estudiante.getId())
                .build();
    }

    /**
     * Obtiene estado público de inscripción (sin autenticación)
     */
    @Transactional(readOnly = true)
    public co.udistrital.academia.dto.EstadoPublicoResponse obtenerEstadoPublico(Long aspiranteId) {
        Aspirante aspirante = aspiranteRepository.findById(aspiranteId)
                .orElseThrow(() -> new ResourceNotFoundException("Aspirante no encontrado"));

        // Obtener primer estudiante del aspirante
        Estudiante estudiante = aspirante.getEstudiantes().stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado"));

        // Construir info del estudiante
        co.udistrital.academia.dto.EstadoPublicoResponse.EstudianteInfo estudianteInfo = 
            co.udistrital.academia.dto.EstadoPublicoResponse.EstudianteInfo.builder()
                .nombre(estudiante.getNombre())
                .apellido(estudiante.getApellido())
                .grado(estudiante.getGrado())
                .fechaNacimiento(null) // TODO: agregar campo fechaNacimiento a Estudiante entity
                .build();

        // Construir respuesta
        return co.udistrital.academia.dto.EstadoPublicoResponse.builder()
                .estado(aspirante.getEstadoInscripcion().toString())
                .fechaEntrevista(aspirante.getFechaEntrevista() != null ? 
                    aspirante.getFechaEntrevista().toString() : null)
                .estudiante(estudianteInfo)
                .build();
    }
}
