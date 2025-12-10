package co.udistrital.academia.repository;

import co.udistrital.academia.entity.TokenUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TokenUsuarioRepository extends JpaRepository<TokenUsuario, Long> {
}
