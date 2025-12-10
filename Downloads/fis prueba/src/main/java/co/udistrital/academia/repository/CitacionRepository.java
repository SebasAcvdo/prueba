package co.udistrital.academia.repository;

import co.udistrital.academia.entity.Citacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CitacionRepository extends JpaRepository<Citacion, Long> {
    
    List<Citacion> findByTipo(Citacion.TipoCitacion tipo);
    
    List<Citacion> findByEstadoCita(Citacion.EstadoCita estadoCita);
}
