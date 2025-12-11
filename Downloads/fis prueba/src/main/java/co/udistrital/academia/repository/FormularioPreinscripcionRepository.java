package co.udistrital.academia.repository;

import co.udistrital.academia.entity.FormularioPreinscripcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FormularioPreinscripcionRepository extends JpaRepository<FormularioPreinscripcion, Long> {
    
    Optional<FormularioPreinscripcion> findByAspiranteId(Long aspiranteId);
}
