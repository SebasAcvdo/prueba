package co.udistrital.academia.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "calificacion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Calificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double valor;

    @Column(nullable = false)
    private Integer periodo;

    @ManyToOne
    @JoinColumn(name = "logro_id", nullable = false)
    private Logro logro;

    @ManyToOne
    @JoinColumn(name = "estudiante_id", nullable = false)
    private Estudiante estudiante;

    @ManyToOne
    @JoinColumn(name = "profesor_id", nullable = false)
    private Usuario profesor;
}
