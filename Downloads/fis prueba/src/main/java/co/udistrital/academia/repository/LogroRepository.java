package co.udistrital.academia.repository;

import co.udistrital.academia.entity.Logro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LogroRepository extends JpaRepository<Logro, Long> {
    
    List<Logro> findByCategoria(Logro.Categoria categoria);
    
    List<Logro> findByEstado(Logro.EstadoLogro estado);
}
