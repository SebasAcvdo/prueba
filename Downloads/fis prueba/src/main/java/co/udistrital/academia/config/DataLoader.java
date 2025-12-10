package co.udistrital.academia.config;

import co.udistrital.academia.entity.*;
import co.udistrital.academia.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataLoader {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    @Profile("dev")
    public CommandLineRunner loadData(
            UsuarioRepository usuarioRepository,
            GrupoRepository grupoRepository,
            EstudianteRepository estudianteRepository,
            AspiranteRepository aspiranteRepository,
            LogroRepository logroRepository) {

        return args -> {
            // 1. Crear Admin
            Usuario admin = Usuario.builder()
                    .nombre("Director")
                    .correo("admin@academia.ud")
                    .password(passwordEncoder.encode("Admin123*"))
                    .rol(Usuario.Rol.ADMIN)
                    .estado(true)
                    .build();
            admin = usuarioRepository.save(admin);

            // 2. Crear Profesores
            Usuario profesor1 = Usuario.builder()
                    .nombre("María González")
                    .correo("maria.gonzalez@academia.ud")
                    .password(passwordEncoder.encode("Prof123*"))
                    .rol(Usuario.Rol.PROFESOR)
                    .estado(true)
                    .build();
            profesor1 = usuarioRepository.save(profesor1);

            Usuario profesor2 = Usuario.builder()
                    .nombre("Carlos Rodríguez")
                    .correo("carlos.rodriguez@academia.ud")
                    .password(passwordEncoder.encode("Prof123*"))
                    .rol(Usuario.Rol.PROFESOR)
                    .estado(true)
                    .build();
            profesor2 = usuarioRepository.save(profesor2);

            // 3. Crear Acudientes con Estudiantes
            Usuario acudiente1 = Usuario.builder()
                    .nombre("Ana Martínez")
                    .correo("ana.martinez@correo.com")
                    .password(passwordEncoder.encode("Acud123*"))
                    .rol(Usuario.Rol.ACUDIENTE)
                    .estado(true)
                    .build();
            acudiente1 = usuarioRepository.save(acudiente1);

            Usuario acudiente2 = Usuario.builder()
                    .nombre("Luis Pérez")
                    .correo("luis.perez@correo.com")
                    .password(passwordEncoder.encode("Acud123*"))
                    .rol(Usuario.Rol.ACUDIENTE)
                    .estado(true)
                    .build();
            acudiente2 = usuarioRepository.save(acudiente2);

            Usuario acudiente3 = Usuario.builder()
                    .nombre("Sandra López")
                    .correo("sandra.lopez@correo.com")
                    .password(passwordEncoder.encode("Acud123*"))
                    .rol(Usuario.Rol.ACUDIENTE)
                    .estado(true)
                    .build();
            acudiente3 = usuarioRepository.save(acudiente3);

            // 4. Crear Grupos
            Grupo grupoParvulosA = Grupo.builder()
                    .nombre("Párvulos A")
                    .grado("Párvulos")
                    .capacidad(20)
                    .estado(Grupo.EstadoGrupo.BORRADOR)
                    .profesor(profesor1)
                    .build();
            grupoParvulosA = grupoRepository.save(grupoParvulosA);

            Grupo grupoParvulosB = Grupo.builder()
                    .nombre("Párvulos B")
                    .grado("Párvulos")
                    .capacidad(20)
                    .estado(Grupo.EstadoGrupo.BORRADOR)
                    .profesor(profesor2)
                    .build();
            grupoParvulosB = grupoRepository.save(grupoParvulosB);

            Grupo grupoCaminadoresA = Grupo.builder()
                    .nombre("Caminadores A")
                    .grado("Caminadores")
                    .capacidad(20)
                    .estado(Grupo.EstadoGrupo.BORRADOR)
                    .profesor(profesor1)
                    .build();
            grupoCaminadoresA = grupoRepository.save(grupoCaminadoresA);

            Grupo grupoCaminadoresB = Grupo.builder()
                    .nombre("Caminadores B")
                    .grado("Caminadores")
                    .capacidad(20)
                    .estado(Grupo.EstadoGrupo.BORRADOR)
                    .profesor(profesor2)
                    .build();
            grupoCaminadoresB = grupoRepository.save(grupoCaminadoresB);

            Grupo grupoPrejardinA = Grupo.builder()
                    .nombre("Pre-jardín A")
                    .grado("Pre-jardín")
                    .capacidad(20)
                    .estado(Grupo.EstadoGrupo.BORRADOR)
                    .profesor(profesor1)
                    .build();
            grupoPrejardinA = grupoRepository.save(grupoPrejardinA);

            Grupo grupoPrejardinB = Grupo.builder()
                    .nombre("Pre-jardín B")
                    .grado("Pre-jardín")
                    .capacidad(20)
                    .estado(Grupo.EstadoGrupo.BORRADOR)
                    .profesor(profesor2)
                    .build();
            grupoPrejardinB = grupoRepository.save(grupoPrejardinB);

            // 5. Crear Estudiantes para Acudientes
            Estudiante est1 = Estudiante.builder()
                    .nombre("Juan")
                    .apellido("Martínez Silva")
                    .grado("Párvulos")
                    .regCivil("RC-12345")
                    .estado(Estudiante.EstadoEstudiante.ACTIVO)
                    .acudiente(acudiente1)
                    .grupo(grupoParvulosA)
                    .build();
            estudianteRepository.save(est1);

            Estudiante est2 = Estudiante.builder()
                    .nombre("María")
                    .apellido("Pérez Gómez")
                    .grado("Caminadores")
                    .regCivil("RC-23456")
                    .estado(Estudiante.EstadoEstudiante.ACTIVO)
                    .acudiente(acudiente2)
                    .grupo(grupoCaminadoresA)
                    .build();
            estudianteRepository.save(est2);

            Estudiante est3 = Estudiante.builder()
                    .nombre("Pedro")
                    .apellido("López Torres")
                    .grado("Pre-jardín")
                    .regCivil("RC-34567")
                    .estado(Estudiante.EstadoEstudiante.ACTIVO)
                    .acudiente(acudiente3)
                    .grupo(grupoPrejardinA)
                    .build();
            estudianteRepository.save(est3);

            // 6. Crear Aspirantes
            Usuario usuarioAspirante1 = Usuario.builder()
                    .nombre("Carmen Díaz")
                    .correo("carmen.diaz@correo.com")
                    .password(passwordEncoder.encode("Asp123*"))
                    .rol(Usuario.Rol.ASPIRANTE)
                    .estado(true)
                    .build();
            usuarioAspirante1 = usuarioRepository.save(usuarioAspirante1);

            Aspirante aspirante1 = Aspirante.builder()
                    .estadoInscripcion(Aspirante.EstadoInscripcion.SIN_REVISAR)
                    .usuario(usuarioAspirante1)
                    .estudiantes(new ArrayList<>())
                    .build();
            aspirante1 = aspiranteRepository.save(aspirante1);

            Estudiante estAsp1 = Estudiante.builder()
                    .nombre("Sofía")
                    .apellido("Díaz Castro")
                    .grado("Párvulos")
                    .regCivil("RC-45678")
                    .estado(Estudiante.EstadoEstudiante.ACTIVO)
                    .aspirante(aspirante1)
                    .build();
            estudianteRepository.save(estAsp1);

            Usuario usuarioAspirante2 = Usuario.builder()
                    .nombre("Roberto Morales")
                    .correo("roberto.morales@correo.com")
                    .password(passwordEncoder.encode("Asp123*"))
                    .rol(Usuario.Rol.ASPIRANTE)
                    .estado(true)
                    .build();
            usuarioAspirante2 = usuarioRepository.save(usuarioAspirante2);

            Aspirante aspirante2 = Aspirante.builder()
                    .estadoInscripcion(Aspirante.EstadoInscripcion.ESPERA_ENTREVISTA)
                    .fechaEntrevista(LocalDate.now().plusDays(10))
                    .usuario(usuarioAspirante2)
                    .estudiantes(new ArrayList<>())
                    .build();
            aspirante2 = aspiranteRepository.save(aspirante2);

            Estudiante estAsp2 = Estudiante.builder()
                    .nombre("Andrés")
                    .apellido("Morales Ruiz")
                    .grado("Caminadores")
                    .regCivil("RC-56789")
                    .estado(Estudiante.EstadoEstudiante.ACTIVO)
                    .aspirante(aspirante2)
                    .build();
            estudianteRepository.save(estAsp2);

            // 7. Crear Logros (3 por categoría = 9 total)
            // PERSONAL_SOCIAL
            Logro logro1 = Logro.builder()
                    .nombre("Interactúa con otros niños")
                    .descripcion("Demuestra habilidades sociales básicas")
                    .categoria(Logro.Categoria.PERSONAL_SOCIAL)
                    .estado(Logro.EstadoLogro.ACTIVO)
                    .build();
            logroRepository.save(logro1);

            Logro logro2 = Logro.builder()
                    .nombre("Reconoce emociones propias")
                    .descripcion("Identifica y expresa sus emociones")
                    .categoria(Logro.Categoria.PERSONAL_SOCIAL)
                    .estado(Logro.EstadoLogro.ACTIVO)
                    .build();
            logroRepository.save(logro2);

            Logro logro3 = Logro.builder()
                    .nombre("Colabora en actividades grupales")
                    .descripcion("Trabaja en equipo con sus compañeros")
                    .categoria(Logro.Categoria.PERSONAL_SOCIAL)
                    .estado(Logro.EstadoLogro.ACTIVO)
                    .build();
            logroRepository.save(logro3);

            // COGNITIVO_LENGUAJE
            Logro logro4 = Logro.builder()
                    .nombre("Reconoce colores primarios")
                    .descripcion("Identifica rojo, azul y amarillo")
                    .categoria(Logro.Categoria.COGNITIVO_LENGUAJE)
                    .estado(Logro.EstadoLogro.ACTIVO)
                    .build();
            logroRepository.save(logro4);

            Logro logro5 = Logro.builder()
                    .nombre("Cuenta hasta 10")
                    .descripcion("Realiza conteo verbal del 1 al 10")
                    .categoria(Logro.Categoria.COGNITIVO_LENGUAJE)
                    .estado(Logro.EstadoLogro.ACTIVO)
                    .build();
            logroRepository.save(logro5);

            Logro logro6 = Logro.builder()
                    .nombre("Expresa ideas verbalmente")
                    .descripcion("Comunica sus necesidades y pensamientos")
                    .categoria(Logro.Categoria.COGNITIVO_LENGUAJE)
                    .estado(Logro.EstadoLogro.ACTIVO)
                    .build();
            logroRepository.save(logro6);

            // AREA_MOTRIZ
            Logro logro7 = Logro.builder()
                    .nombre("Salta con ambos pies")
                    .descripcion("Demuestra coordinación motriz gruesa")
                    .categoria(Logro.Categoria.AREA_MOTRIZ)
                    .estado(Logro.EstadoLogro.ACTIVO)
                    .build();
            logroRepository.save(logro7);

            Logro logro8 = Logro.builder()
                    .nombre("Toma el lápiz correctamente")
                    .descripcion("Usa la pinza digital para escribir")
                    .categoria(Logro.Categoria.AREA_MOTRIZ)
                    .estado(Logro.EstadoLogro.ACTIVO)
                    .build();
            logroRepository.save(logro8);

            Logro logro9 = Logro.builder()
                    .nombre("Mantiene el equilibrio")
                    .descripcion("Se para en un pie por 5 segundos")
                    .categoria(Logro.Categoria.AREA_MOTRIZ)
                    .estado(Logro.EstadoLogro.ACTIVO)
                    .build();
            logroRepository.save(logro9);

            System.out.println("✅ Datos iniciales cargados correctamente");
            System.out.println("📧 Admin: admin@academia.ud / Admin123*");
            System.out.println("📧 Profesor 1: maria.gonzalez@academia.ud / Prof123*");
            System.out.println("📧 Profesor 2: carlos.rodriguez@academia.ud / Prof123*");
        };
    }
}
