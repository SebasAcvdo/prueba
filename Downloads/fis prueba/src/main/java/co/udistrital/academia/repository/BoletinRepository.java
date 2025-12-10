package co.udistrital.academia.repository;

import co.udistrital.academia.entity.Boletin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoletinRepository extends JpaRepository<Boletin, Long> {
    
    List<Boletin> findByEstudianteId(Long estudianteId);
    
    List<Boletin> findByEstudianteIdAndPeriodo(Long estudianteId, Integer periodo);
}
