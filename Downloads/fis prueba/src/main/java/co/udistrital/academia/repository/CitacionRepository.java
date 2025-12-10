package co.udistrital.academia.repository;

import co.udistrital.academia.entity.Citacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CitacionRepository extends JpaRepository<Citacion, Long> {
    
    List<Citacion> findByTipo(Citacion.TipoCitacion tipo);
    
    List<Citacion> findByEstadoCita(Citacion.EstadoCita estadoCita);
    
    Page<Citacion> findByTipo(Citacion.TipoCitacion tipo, Pageable pageable);
    
    Page<Citacion> findByEstadoCita(Citacion.EstadoCita estadoCita, Pageable pageable);
    
    Page<Citacion> findByTipoAndEstadoCita(Citacion.TipoCitacion tipo, Citacion.EstadoCita estadoCita, Pageable pageable);
}
