package co.udistrital.academia.repository;

import co.udistrital.academia.entity.Grupo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GrupoRepository extends JpaRepository<Grupo, Long> {
    
    List<Grupo> findByProfesorId(Long profesorId);
    
    List<Grupo> findByGrado(String grado);
    
    Page<Grupo> findByEstado(Grupo.EstadoGrupo estado, Pageable pageable);
}
