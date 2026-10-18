package cl.duoc.rutaexpress.bff.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.security.Principal;
import java.util.List;

/**
 * Controlador legacy BFF - mantiene compatibilidad con /api/bff/shipments
 * Los envíos reales se obtienen desde ms-shipments vía el Gateway en /api/v1/shipments
 */
@RestController
@RequestMapping("/api/bff/shipments")
public class ShipmentBffController {

    @GetMapping
    public ResponseEntity<?> getShipments(Principal principal) {
        return ResponseEntity.ok(List.of(
            "Envío RE00123 - Este endpoint es legacy. Use /api/v1/shipments (Gateway → ms-shipments)",
            "Autenticado como: " + (principal != null ? principal.getName() : "anónimo")
        ));
    }
}