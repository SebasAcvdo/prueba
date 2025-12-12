package co.udistrital.academia.repository;

import co.udistrital.academia.entity.Observacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ObservacionRepository extends JpaRepository<Observacion, Long> {
    List<Observacion> findByEstudianteIdOrderByFechaDesc(Long estudianteId);
    List<Observacion> findByProfesorIdOrderByFechaDesc(Long profesorId);
}
