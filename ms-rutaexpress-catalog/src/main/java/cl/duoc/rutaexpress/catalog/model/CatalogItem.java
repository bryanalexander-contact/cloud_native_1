package cl.duoc.rutaexpress.catalog.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "catalog_items")
@Data
public class CatalogItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private String category; // "vehiculo", "ruta", "sucursal"

    @Column(nullable = false)
    private Boolean active;

    public CatalogItem() {
        this.active = true;
    }

    public CatalogItem(Long id, String name, String description, String category, Boolean active) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.active = active != null ? active : true;
    }
}