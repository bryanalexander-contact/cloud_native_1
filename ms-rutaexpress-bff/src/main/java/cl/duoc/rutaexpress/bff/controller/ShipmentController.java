package cl.duoc.rutaexpress.bff.controller;

import cl.duoc.rutaexpress.bff.dto.ShipmentDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/shipments")
public class ShipmentController {

    private final List<ShipmentDto> shipments = new ArrayList<>();

    public ShipmentController() {
        shipments.add(new ShipmentDto("1", "REX-2026-001", "Santiago Centro", "Maipú", "Juan Pérez", "IN_TRANSIT", LocalDateTime.now().minusHours(2)));
        shipments.add(new ShipmentDto("2", "REX-2026-002", "Providencia", "Buin", "María González", "PENDING", LocalDateTime.now().minusMinutes(45)));
        shipments.add(new ShipmentDto("3", "REX-2026-003", "Las Condes", "San Bernardo", "Carlos Rojas", "DELIVERED", LocalDateTime.now().minusDays(1)));
    }

    @GetMapping
    public ResponseEntity<List<ShipmentDto>> getAllShipments() {
        return ResponseEntity.ok(shipments);
    }

    @PostMapping
    public ResponseEntity<ShipmentDto> createShipment(@RequestBody ShipmentDto newShipment) {
        newShipment.setId(UUID.randomUUID().toString());
        newShipment.setTrackingCode("REX-2026-" + String.format("%03d", shipments.size() + 1));
        newShipment.setCreatedAt(LocalDateTime.now());
        if (newShipment.getStatus() == null) {
            newShipment.setStatus("PENDING");
        }
        shipments.add(0, newShipment);
        return ResponseEntity.ok(newShipment);
    }
}