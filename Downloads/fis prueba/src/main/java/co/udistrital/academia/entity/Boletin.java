package co.udistrital.academia.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "boletin")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Boletin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private Integer periodo;

    @ManyToOne
    @JoinColumn(name = "estudiante_id", nullable = false)
    private Estudiante estudiante;

    @ManyToMany
    @JoinTable(
        name = "boletin_logro",
        joinColumns = @JoinColumn(name = "boletin_id"),
        inverseJoinColumns = @JoinColumn(name = "logro_id")
    )
    @Builder.Default
    private List<Logro> logros = new ArrayList<>();

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "historia_academica_id")
    private HistoriaAcademica historiaAcademica;
}
