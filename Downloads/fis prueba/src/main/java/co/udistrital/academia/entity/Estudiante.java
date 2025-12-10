package co.udistrital.academia.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "estudiante")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Estudiante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String apellido;

    @Column(nullable = false, length = 50)
    private String grado;

    @Column(name = "reg_civil", length = 50)
    private String regCivil;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private EstadoEstudiante estado = EstadoEstudiante.ACTIVO;

    @ManyToOne
    @JoinColumn(name = "acudiente_id")
    private Usuario acudiente;

    @ManyToOne
    @JoinColumn(name = "grupo_id")
    private Grupo grupo;

    @ManyToOne
    @JoinColumn(name = "aspirante_id")
    private Aspirante aspirante;

    @JsonIgnore
    @OneToMany(mappedBy = "estudiante", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Calificacion> calificaciones = new ArrayList<>();

    @JsonIgnore
    @OneToOne(mappedBy = "estudiante", cascade = CascadeType.ALL)
    private HistoriaAcademica historiaAcademica;

    public enum EstadoEstudiante {
        ACTIVO, INACTIVO, RETIRADO
    }
}
