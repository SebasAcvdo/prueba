package co.udistrital.academia.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "aspirante")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Aspirante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_inscripcion", nullable = false, length = 30)
    @Builder.Default
    private EstadoInscripcion estadoInscripcion = EstadoInscripcion.SIN_REVISAR;

    @Column(name = "fecha_entrevista")
    private LocalDate fechaEntrevista;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @JsonIgnore
    @OneToMany(mappedBy = "aspirante", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Estudiante> estudiantes = new ArrayList<>();

    @JsonIgnore
    @ManyToMany(mappedBy = "aspirantes")
    @Builder.Default
    private List<Citacion> citaciones = new ArrayList<>();

    public enum EstadoInscripcion {
        SIN_REVISAR, REVISADO, ESPERA_ENTREVISTA, APROBADO, RECHAZADO
    }
}
