package co.udistrital.academia.repository;

import co.udistrital.academia.entity.Aspirante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AspiranteRepository extends JpaRepository<Aspirante, Long> {
    
    Optional<Aspirante> findByUsuarioId(Long usuarioId);
}
