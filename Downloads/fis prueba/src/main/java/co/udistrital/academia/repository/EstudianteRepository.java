package co.udistrital.academia.repository;

import co.udistrital.academia.entity.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EstudianteRepository extends JpaRepository<Estudiante, Long> {
    
    List<Estudiante> findByAcudienteId(Long acudienteId);
    
    List<Estudiante> findByGrupoId(Long grupoId);
}
