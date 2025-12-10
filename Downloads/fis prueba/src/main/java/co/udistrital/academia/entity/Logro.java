package co.udistrital.academia.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "logro")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Logro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String nombre;

    @Column(length = 500)
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Categoria categoria;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private EstadoLogro estado = EstadoLogro.ACTIVO;

    @JsonIgnore
    @OneToMany(mappedBy = "logro", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Calificacion> calificaciones = new ArrayList<>();

    @JsonIgnore
    @ManyToMany(mappedBy = "logros")
    @Builder.Default
    private List<Boletin> boletines = new ArrayList<>();

    public enum Categoria {
        PERSONAL_SOCIAL, COGNITIVO_LENGUAJE, AREA_MOTRIZ
    }

    public enum EstadoLogro {
        ACTIVO, DESACTIVADO
    }
}
