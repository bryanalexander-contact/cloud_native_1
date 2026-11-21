package cl.duoc.rutaexpress.catalog.repository;

import cl.duoc.rutaexpress.catalog.model.CatalogItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CatalogRepository extends JpaRepository<CatalogItem, Long> {

    List<CatalogItem> findByCategory(String category);

    List<CatalogItem> findByActiveTrue();
}
