package co.udistrital.academia.repository;

import co.udistrital.academia.entity.Calificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CalificacionRepository extends JpaRepository<Calificacion, Long> {
    
    List<Calificacion> findByEstudianteId(Long estudianteId);
    
    List<Calificacion> findByEstudianteIdAndPeriodo(Long estudianteId, Integer periodo);
    
    List<Calificacion> findByProfesorId(Long profesorId);
    
    @Query("SELECT c FROM Calificacion c WHERE c.estudiante.id = :estudianteId AND c.periodo = :periodo")
    List<Calificacion> findCalificacionesByEstudianteAndPeriodo(
        @Param("estudianteId") Long estudianteId, 
        @Param("periodo") Integer periodo
    );
}
