package co.udistrital.academia.service;

import co.udistrital.academia.dto.LogroRequest;
import co.udistrital.academia.dto.LogroResponse;
import co.udistrital.academia.entity.Logro;
import co.udistrital.academia.exception.InvalidOperationException;
import co.udistrital.academia.exception.ResourceNotFoundException;
import co.udistrital.academia.repository.LogroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LogroService {

    @Autowired
    private LogroRepository logroRepository;

    @Transactional
    public LogroResponse crearLogro(LogroRequest request) {
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

        logro = logroRepository.save(logro);
        return toResponse(logro);
    }

    @Transactional(readOnly = true)
    public List<LogroResponse> listarLogros() {
        return logroRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LogroResponse> listarPorCategoria(String categoria) {
        Logro.Categoria cat;
        try {
            cat = Logro.Categoria.valueOf(categoria.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidOperationException("Categoría inválida: " + categoria);
        }

        return logroRepository.findByCategoria(cat).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public LogroResponse actualizarLogro(Long id, LogroRequest request) {
        Logro logro = logroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Logro no encontrado"));

        logro.setNombre(request.nombre());
        logro.setDescripcion(request.descripcion());
        
        try {
            logro.setCategoria(Logro.Categoria.valueOf(request.categoria().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new InvalidOperationException("Categoría inválida: " + request.categoria());
        }

        logro = logroRepository.save(logro);
        return toResponse(logro);
    }

    @Transactional
    public void eliminarLogro(Long id) {
        if (!logroRepository.existsById(id)) {
            throw new ResourceNotFoundException("Logro no encontrado");
        }
        logroRepository.deleteById(id);
    }

    private LogroResponse toResponse(Logro logro) {
        return new LogroResponse(
                logro.getId(),
                logro.getNombre(),
                logro.getDescripcion(),
                logro.getCategoria().name(),
                logro.getEstado().name()
        );
    }
}
