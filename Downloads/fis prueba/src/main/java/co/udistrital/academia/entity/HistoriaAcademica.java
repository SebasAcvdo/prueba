package co.udistrital.academia.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "historia_academica")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoriaAcademica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "estudiante_id", nullable = false)
    private Estudiante estudiante;

    @OneToMany(mappedBy = "historiaAcademica", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Boletin> boletines = new ArrayList<>();
}
