package co.udistrital.academia.config;

import co.udistrital.academia.entity.*;
import co.udistrital.academia.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Configuration
public class DataLoaderEnhanced {

    private static final Logger logger = LoggerFactory.getLogger(DataLoaderEnhanced.class);
    private final Random random = new Random();

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final String[] nombres = {"Juan", "María", "Pedro", "Ana", "Luis", "Carmen", "José", "Laura", "Carlos", "Isabel",
            "Miguel", "Rosa", "Antonio", "Patricia", "Francisco", "Lucía", "Manuel", "Elena", "David", "Marta",
            "Javier", "Sara", "Daniel", "Paula", "Alejandro", "Sofía", "Fernando", "Andrea", "Ricardo", "Claudia"};

    private final String[] apellidos = {"García", "Rodríguez", "Martínez", "López", "González", "Pérez", "Sánchez", "Ramírez",
            "Torres", "Flores", "Rivera", "Gómez", "Díaz", "Cruz", "Morales", "Herrera", "Jiménez", "Méndez",
            "Castro", "Ortiz", "Ruiz", "Vargas", "Silva", "Rojas", "Molina", "Gutiérrez", "Castillo", "Reyes"};

    private final String[] grados = {"Párvulos", "Caminadores", "Pre-jardín"};

    @Bean
    @Profile("dev")
    public CommandLineRunner loadEnhancedData(
            UsuarioRepository usuarioRepository,
            GrupoRepository grupoRepository,
            EstudianteRepository estudianteRepository,
            AspiranteRepository aspiranteRepository,
            LogroRepository logroRepository,
            CalificacionRepository calificacionRepository,
            CitacionRepository citacionRepository,
            ObservacionRepository observacionRepository) {

        return args -> {
            logger.info("🚀 Iniciando carga de datos mejorados para FASE 3...");

            // 1. CREAR ADMIN
            Usuario admin = Usuario.builder()
                    .nombre("Director Academia")
                    .correo("admin@academia.ud")
                    .password(passwordEncoder.encode("Admin123*"))
                    .rol(Usuario.Rol.ADMIN)
                    .estado(true)
                    .build();
            admin = usuarioRepository.save(admin);
            logger.info("✅ Admin creado");

            // 2. CREAR 15 PROFESORES
            List<Usuario> profesores = new ArrayList<>();
            for (int i = 0; i < 15; i++) {
                Usuario profesor = Usuario.builder()
                        .nombre(getNombreCompleto())
                        .correo("profesor" + (i + 1) + "@academia.ud")
                        .password(passwordEncoder.encode("Prof123*"))
                        .rol(Usuario.Rol.PROFESOR)
                        .estado(true)
                        .build();
                profesores.add(usuarioRepository.save(profesor));
            }
            logger.info("✅ 15 profesores creados");

            // 3. CREAR 35 ACUDIENTES
            List<Usuario> acudientes = new ArrayList<>();
            for (int i = 0; i < 35; i++) {
                Usuario acudiente = Usuario.builder()
                        .nombre(getNombreCompleto())
                        .correo("acudiente" + (i + 1) + "@correo.com")
                        .password(passwordEncoder.encode("Acud123*"))
                        .rol(Usuario.Rol.ACUDIENTE)
                        .estado(true)
                        .build();
                acudientes.add(usuarioRepository.save(acudiente));
            }
            logger.info("✅ 35 acudientes creados");

            // 4. CREAR 20 GRUPOS (4 por grado)
            List<Grupo> grupos = new ArrayList<>();
            int profesorIndex = 0;
            for (String grado : grados) {
                for (int i = 0; i < 4; i++) {
                    Grupo grupo = Grupo.builder()
                            .nombre(grado + " " + (char) ('A' + i))
                            .grado(grado)
                            .capacidad(10)
                            .estado(i < 2 ? Grupo.EstadoGrupo.ACTIVO : Grupo.EstadoGrupo.BORRADOR)
                            .profesor(profesores.get(profesorIndex % profesores.size()))
                            .build();
                    grupos.add(grupoRepository.save(grupo));
                    profesorIndex++;
                }
            }
            logger.info("✅ 20 grupos creados");

            // 5. CREAR 70 ESTUDIANTES REGULARES (distribuidos en grupos)
            List<Estudiante> estudiantes = new ArrayList<>();
            int estudianteCount = 0;
            for (Grupo grupo : grupos) {
                if (grupo.getEstado() == Grupo.EstadoGrupo.ACTIVO) {
                    // Asignar 3-5 estudiantes por grupo activo
                    int cantidadEstudiantes = 3 + random.nextInt(3);
                    for (int i = 0; i < cantidadEstudiantes && estudianteCount < 70; i++) {
                        Usuario acudiente = acudientes.get(estudianteCount % acudientes.size());
                        Estudiante estudiante = Estudiante.builder()
                                .nombre(nombres[random.nextInt(nombres.length)])
                                .apellido(getApellidoCompleto())
                                .grado(grupo.getGrado())
                                .regCivil("RC-" + (100000 + estudianteCount))
                                .estado(Estudiante.EstadoEstudiante.ACTIVO)
                                .acudiente(acudiente)
                                .grupo(grupo)
                                .build();
                        estudiantes.add(estudianteRepository.save(estudiante));
                        estudianteCount++;
                    }
                }
            }
            logger.info("✅ " + estudiantes.size() + " estudiantes regulares creados");

            // 6. CREAR 30 ASPIRANTES
            List<Aspirante> aspirantes = new ArrayList<>();
            Aspirante.EstadoInscripcion[] estados = Aspirante.EstadoInscripcion.values();
            for (int i = 0; i < 30; i++) {
                Usuario usuarioAspirante = Usuario.builder()
                        .nombre(getNombreCompleto())
                        .correo("aspirante" + (i + 1) + "@correo.com")
                        .password(passwordEncoder.encode("Asp123*"))
                        .rol(Usuario.Rol.ASPIRANTE)
                        .estado(true)
                        .build();
                usuarioAspirante = usuarioRepository.save(usuarioAspirante);

                Aspirante.EstadoInscripcion estadoAspirante = estados[i % estados.length];
                Aspirante aspirante = Aspirante.builder()
                        .estadoInscripcion(estadoAspirante)
                        .usuario(usuarioAspirante)
                        .estudiantes(new ArrayList<>())
                        .build();

                if (estadoAspirante == Aspirante.EstadoInscripcion.ESPERA_ENTREVISTA) {
                    aspirante.setFechaEntrevista(LocalDate.now().plusDays(5 + random.nextInt(20)));
                }

                aspirante = aspiranteRepository.save(aspirante);
                aspirantes.add(aspirante);

                // Cada aspirante tiene 1-2 estudiantes
                int cantEst = 1 + random.nextInt(2);
                for (int j = 0; j < cantEst; j++) {
                    Estudiante estudianteAsp = Estudiante.builder()
                            .nombre(nombres[random.nextInt(nombres.length)])
                            .apellido(getApellidoCompleto())
                            .grado(grados[random.nextInt(grados.length)])
                            .regCivil("RC-ASP-" + (i * 10 + j))
                            .estado(Estudiante.EstadoEstudiante.ACTIVO)
                            .aspirante(aspirante)
                            .build();
                    estudianteRepository.save(estudianteAsp);
                }
            }
            logger.info("✅ 30 aspirantes creados");

            // 7. CREAR 9 LOGROS (3 por categoría)
            List<Logro> logros = new ArrayList<>();
            String[][] logrosData = {
                    {"Interactúa con otros niños", "Demuestra habilidades sociales básicas", "PERSONAL_SOCIAL"},
                    {"Reconoce emociones propias", "Identifica y expresa sus emociones", "PERSONAL_SOCIAL"},
                    {"Colabora en actividades grupales", "Trabaja en equipo con sus compañeros", "PERSONAL_SOCIAL"},
                    {"Reconoce colores primarios", "Identifica rojo, azul y amarillo", "COGNITIVO_LENGUAJE"},
                    {"Cuenta hasta 10", "Realiza conteo verbal del 1 al 10", "COGNITIVO_LENGUAJE"},
                    {"Expresa ideas verbalmente", "Comunica sus necesidades y pensamientos", "COGNITIVO_LENGUAJE"},
                    {"Salta con ambos pies", "Demuestra coordinación motriz gruesa", "AREA_MOTRIZ"},
                    {"Toma el lápiz correctamente", "Usa la pinza digital para escribir", "AREA_MOTRIZ"},
                    {"Mantiene el equilibrio", "Se para en un pie por 5 segundos", "AREA_MOTRIZ"}
            };

            for (String[] logroData : logrosData) {
                Logro logro = Logro.builder()
                        .nombre(logroData[0])
                        .descripcion(logroData[1])
                        .categoria(Logro.Categoria.valueOf(logroData[2]))
                        .estado(Logro.EstadoLogro.ACTIVO)
                        .build();
                logros.add(logroRepository.save(logro));
            }
            logger.info("✅ 9 logros creados");

            // 8. CREAR 120 CALIFICACIONES (para estudiantes regulares)
            int calificacionCount = 0;
            for (Estudiante estudiante : estudiantes) {
                if (calificacionCount >= 120) break;
                
                // Cada estudiante tiene calificaciones en 2 periodos
                for (int periodo = 1; periodo <= 2; periodo++) {
                    // 2-3 logros por periodo
                    int cantLogros = 2 + random.nextInt(2);
                    for (int i = 0; i < cantLogros && calificacionCount < 120; i++) {
                        Logro logro = logros.get(random.nextInt(logros.size()));
                        double valor = 3.0 + (random.nextDouble() * 2.0); // Entre 3.0 y 5.0
                        valor = Math.round(valor * 10.0) / 10.0; // Redondear a 1 decimal

                        Calificacion calificacion = Calificacion.builder()
                                .valor(valor)
                                .periodo(periodo)
                                .logro(logro)
                                .estudiante(estudiante)
                                .profesor(estudiante.getGrupo().getProfesor())
                                .build();
                        calificacionRepository.save(calificacion);
                        calificacionCount++;
                    }
                }
            }
            logger.info("✅ " + calificacionCount + " calificaciones creadas");

            // 9. CREAR 50 CITACIONES (distribuidas por tipo)
            for (int i = 0; i < 50; i++) {
                Citacion.TipoCitacion tipo;
                if (i < 20) {
                    tipo = Citacion.TipoCitacion.INDIVIDUAL;
                } else if (i < 35) {
                    tipo = Citacion.TipoCitacion.GRUPAL;
                } else {
                    tipo = Citacion.TipoCitacion.ASPIRANTE;
                }

                Citacion citacion = Citacion.builder()
                        .tipo(tipo)
                        .fecha(LocalDateTime.now().plusDays(random.nextInt(30)))
                        .motivo("Reunión " + (i + 1) + " - " + tipo.name())
                        .estadoCita(i % 3 == 0 ? Citacion.EstadoCita.REALIZADA : 
                                   i % 3 == 1 ? Citacion.EstadoCita.CANCELADA : 
                                   Citacion.EstadoCita.PENDIENTE)
                        .build();

                if (tipo == Citacion.TipoCitacion.INDIVIDUAL) {
                    citacion.getAcudientes().add(acudientes.get(i % acudientes.size()));
                    citacion.getProfesores().add(profesores.get(i % profesores.size()));
                } else if (tipo == Citacion.TipoCitacion.GRUPAL) {
                    // 3-5 acudientes por citación grupal
                    int cantAcud = 3 + random.nextInt(3);
                    for (int j = 0; j < cantAcud; j++) {
                        citacion.getAcudientes().add(acudientes.get((i + j) % acudientes.size()));
                    }
                    citacion.getProfesores().add(profesores.get(i % profesores.size()));
                } else { // ASPIRANTE
                    citacion.getAspirantes().add(aspirantes.get(i % aspirantes.size()));
                }

                citacionRepository.save(citacion);
            }
            logger.info("✅ 50 citaciones creadas");

            // 10. CREAR 80 OBSERVACIONES (para estudiantes regulares)
            Observacion.TipoObservacion[] tiposObs = Observacion.TipoObservacion.values();
            String[] descripciones = {
                "Muestra excelente comportamiento en clase",
                "Demuestra liderazgo positivo con sus compañeros",
                "Requiere refuerzo en seguimiento de instrucciones",
                "Participación activa y destacada en actividades",
                "Presenta dificultades para mantener la atención",
                "Colabora de manera efectiva en trabajos grupales",
                "Ha mejorado significativamente su desempeño",
                "Necesita apoyo adicional en convivencia"
            };
            
            int obsCount = 0;
            for (Estudiante estudiante : estudiantes) {
                if (obsCount >= 80) break;
                
                // 1-2 observaciones por estudiante
                int cantObs = 1 + random.nextInt(2);
                for (int i = 0; i < cantObs && obsCount < 80; i++) {
                    Observacion observacion = Observacion.builder()
                        .fecha(LocalDate.now().minusDays(random.nextInt(60)))
                        .descripcion(descripciones[random.nextInt(descripciones.length)])
                        .tipo(tiposObs[random.nextInt(tiposObs.length)])
                        .estudiante(estudiante)
                        .profesor(estudiante.getGrupo().getProfesor())
                        .build();
                    observacionRepository.save(observacion);
                    obsCount++;
                }
            }
            logger.info("✅ " + obsCount + " observaciones creadas");

            // RESUMEN FINAL
            logger.info("");
            logger.info("========================================");
            logger.info("✅ DATOS INICIALES CARGADOS - FASE 3");
            logger.info("========================================");
            logger.info("👤 Usuarios: " + usuarioRepository.count());
            logger.info("   - Admin: 1");
            logger.info("   - Profesores: 15");
            logger.info("   - Acudientes: 35");
            logger.info("   - Aspirantes: 30");
            logger.info("📚 Grupos: " + grupoRepository.count());
            logger.info("👨‍🎓 Estudiantes: " + estudianteRepository.count());
            logger.info("📝 Aspirantes: " + aspiranteRepository.count());
            logger.info("🎯 Logros: " + logroRepository.count());
            logger.info("📊 Calificaciones: " + calificacionRepository.count());
            logger.info("📅 Citaciones: " + citacionRepository.count());
            logger.info("📋 Observaciones: " + observacionRepository.count());
            logger.info("========================================");
            logger.info("🔑 Credenciales de Prueba:");
            logger.info("   Admin: admin@academia.ud / Admin123*");
            logger.info("   Profesor: profesor1@academia.ud / Prof123*");
            logger.info("   Acudiente: acudiente1@correo.com / Acud123*");
            logger.info("   Aspirante: aspirante1@correo.com / Asp123*");
            logger.info("========================================");
        };
    }

    private String getNombreCompleto() {
        return nombres[random.nextInt(nombres.length)] + " " + 
               nombres[random.nextInt(nombres.length)];
    }

    private String getApellidoCompleto() {
        return apellidos[random.nextInt(apellidos.length)] + " " + 
               apellidos[random.nextInt(apellidos.length)];
    }
}
