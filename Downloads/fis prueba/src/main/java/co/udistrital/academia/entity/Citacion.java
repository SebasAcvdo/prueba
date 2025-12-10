package co.udistrital.academia.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "citacion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Citacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoCitacion tipo;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(nullable = false, length = 500)
    private String motivo;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_cita", nullable = false, length = 20)
    @Builder.Default
    private EstadoCita estadoCita = EstadoCita.PENDIENTE;

    @ManyToMany
    @JoinTable(
        name = "citacion_acudiente",
        joinColumns = @JoinColumn(name = "citacion_id"),
        inverseJoinColumns = @JoinColumn(name = "acudiente_id")
    )
    @Builder.Default
    private List<Usuario> acudientes = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "citacion_profesor",
        joinColumns = @JoinColumn(name = "citacion_id"),
        inverseJoinColumns = @JoinColumn(name = "profesor_id")
    )
    @Builder.Default
    private List<Usuario> profesores = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "citacion_aspirante",
        joinColumns = @JoinColumn(name = "citacion_id"),
        inverseJoinColumns = @JoinColumn(name = "aspirante_id")
    )
    @Builder.Default
    private List<Aspirante> aspirantes = new ArrayList<>();

    public enum TipoCitacion {
        INDIVIDUAL, GRUPAL, ASPIRANTE
    }

    public enum EstadoCita {
        PENDIENTE, REALIZADA, CANCELADA, APLAZADA
    }
}
