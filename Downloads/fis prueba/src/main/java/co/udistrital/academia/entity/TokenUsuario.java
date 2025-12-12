package co.udistrital.academia.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "token_usuario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_temporal", length = 50)
    private String usuarioTemporal;

    @Column(name = "contrasena_temporal")
    private String contrasenaTemporal;

    @Column(name = "cambiar_pass")
    @Builder.Default
    private Boolean cambiarPass = false;

    @OneToOne(mappedBy = "tokenUsuario")
    private Usuario usuario;
}
