package co.udistrital.academia.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "grupo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Grupo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 50)
    private String grado;

    @Column(nullable = false)
    @Builder.Default
    private Integer capacidad = 20;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private EstadoGrupo estado = EstadoGrupo.BORRADOR;

    @ManyToOne
    @JoinColumn(name = "profesor_id")
    private Usuario profesor;

    @JsonIgnore
    @OneToMany(mappedBy = "grupo", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Estudiante> estudiantes = new ArrayList<>();

    public enum EstadoGrupo {
        BORRADOR, ACTIVO
    }
}
