package cl.duoc.rutaexpress.catalog.controller;

import cl.duoc.rutaexpress.catalog.model.CatalogItem;
import cl.duoc.rutaexpress.catalog.repository.CatalogRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/catalog")
public class CatalogController {

    private final CatalogRepository catalogRepository;

    public CatalogController(CatalogRepository catalogRepository) {
        this.catalogRepository = catalogRepository;
    }

    /** Listar todos los ítems activos del catálogo */
    @GetMapping
    public ResponseEntity<List<CatalogItem>> getAll() {
        return ResponseEntity.ok(catalogRepository.findByActiveTrue());
    }

    /** Obtener un ítem por ID */
    @GetMapping("/{id}")
    public ResponseEntity<CatalogItem> getById(@PathVariable Long id) {
        return catalogRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** Listar ítems por categoría */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<CatalogItem>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(catalogRepository.findByCategory(category));
    }

    /** Crear un nuevo ítem en el catálogo */
    @PostMapping
    public ResponseEntity<CatalogItem> create(@RequestBody CatalogItem item) {
        item.setActive(true);
        CatalogItem saved = catalogRepository.save(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /** Actualizar un ítem existente */
    @PutMapping("/{id}")
    public ResponseEntity<CatalogItem> update(@PathVariable Long id, @RequestBody CatalogItem item) {
        return catalogRepository.findById(id)
                .map(existing -> {
                    existing.setName(item.getName());
                    existing.setDescription(item.getDescription());
                    existing.setCategory(item.getCategory());
                    return ResponseEntity.ok(catalogRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /** Desactivar (soft delete) un ítem */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return catalogRepository.findById(id)
                .map(existing -> {
                    existing.setActive(false);
                    catalogRepository.save(existing);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
