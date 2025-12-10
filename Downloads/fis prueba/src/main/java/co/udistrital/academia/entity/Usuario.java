package co.udistrital.academia.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "usuario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, unique = true, length = 120)
    private String correo;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Rol rol;

    @Column(nullable = false)
    @Builder.Default
    private Boolean estado = true;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "token_usuario_id")
    private TokenUsuario tokenUsuario;

    @OneToMany(mappedBy = "acudiente", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Estudiante> estudiantesACargo = new ArrayList<>();

    @OneToMany(mappedBy = "profesor", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Grupo> gruposDictados = new ArrayList<>();

    @ManyToMany(mappedBy = "acudientes")
    @Builder.Default
    private List<Citacion> citacionesAcudiente = new ArrayList<>();

    @ManyToMany(mappedBy = "profesores")
    @Builder.Default
    private List<Citacion> citacionesProfesor = new ArrayList<>();

    @OneToMany(mappedBy = "profesor", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Calificacion> calificacionesCreadas = new ArrayList<>();

    public enum Rol {
        ADMIN, PROFESOR, ACUDIENTE, ASPIRANTE
    }
}
