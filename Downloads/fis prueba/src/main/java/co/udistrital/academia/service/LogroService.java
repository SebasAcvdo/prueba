package co.udistrital.academia.service;

import co.udistrital.academia.dto.LogroRequest;
import co.udistrital.academia.entity.Logro;
import co.udistrital.academia.exception.InvalidOperationException;
import co.udistrital.academia.exception.ResourceNotFoundException;
import co.udistrital.academia.repository.LogroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LogroService {

    @Autowired
    private LogroRepository logroRepository;

    @Transactional
    public Logro crearLogro(LogroRequest request) {
        Logro.Categoria categoria;
        try {
            categoria = Logro.Categoria.valueOf(request.categoria().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidOperationException("Categoría inválida: " + request.categoria());
        }

        Logro logro = Logro.builder()
                .nombre(request.nombre())
                .descripcion(request.descripcion())
                .categoria(categoria)
                .estado(Logro.EstadoLogro.ACTIVO)
                .build();

        return logroRepository.save(logro);
    }

    @Transactional(readOnly = true)
    public List<Logro> listarLogros() {
        return logroRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Logro> listarPorCategoria(String categoria) {
        Logro.Categoria cat;
        try {
            cat = Logro.Categoria.valueOf(categoria.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidOperationException("Categoría inválida: " + categoria);
        }

        return logroRepository.findByCategoria(cat);
    }

    @Transactional
    public Logro actualizarLogro(Long id, LogroRequest request) {
        Logro logro = logroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Logro no encontrado"));

        logro.setNombre(request.nombre());
        logro.setDescripcion(request.descripcion());
        
        try {
            logro.setCategoria(Logro.Categoria.valueOf(request.categoria().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new InvalidOperationException("Categoría inválida: " + request.categoria());
        }

        return logroRepository.save(logro);
    }

    @Transactional
    public void eliminarLogro(Long id) {
        Logro logro = logroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Logro no encontrado"));
        
        // Borrado lógico: cambiar estado a DESACTIVADO
        logro.setEstado(Logro.EstadoLogro.DESACTIVADO);
        logroRepository.save(logro);
    }
}
