package co.udistrital.academia.repository;

import co.udistrital.academia.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    Optional<Usuario> findByCorreo(String correo);
    
    boolean existsByCorreo(String correo);
    
    Optional<Usuario> findByCorreoAndEstado(String correo, Boolean estado);
}
