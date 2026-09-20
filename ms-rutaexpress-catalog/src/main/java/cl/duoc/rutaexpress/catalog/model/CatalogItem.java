package cl.duoc.rutaexpress.catalog.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "catalog_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
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
    private Boolean active = true;
}
