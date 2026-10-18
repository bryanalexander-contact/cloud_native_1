package cl.duoc.rutaexpress.shipments.controller;

import cl.duoc.rutaexpress.shipments.dto.UpdateShipmentStatusDTO;
import cl.duoc.rutaexpress.shipments.model.Shipment;
import cl.duoc.rutaexpress.shipments.repository.ShipmentRepository;
import cl.duoc.rutaexpress.shipments.service.ShipmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shipments")
public class ShipmentController {

    private final ShipmentService shipmentService;
    private final ShipmentRepository shipmentRepository;

    public ShipmentController(ShipmentService shipmentService, ShipmentRepository shipmentRepository) {
        this.shipmentService = shipmentService;
        this.shipmentRepository = shipmentRepository;
    }

    /** Listar todos los envíos */
    @GetMapping
    public ResponseEntity<List<Shipment>> getAllShipments() {
        List<Shipment> shipments = shipmentRepository.findAll();
        return ResponseEntity.ok(shipments);
    }

    /** Crear un nuevo envío */
    @PostMapping
    public ResponseEntity<Shipment> createShipment(@RequestBody Shipment shipment) {
        Shipment saved = shipmentRepository.save(shipment);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /** Actualizar estado de un envío y disparar evento Kafka */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateShipmentStatusDTO dto) {
        var updated = shipmentService.updateStatus(id, dto);
        return ResponseEntity.ok(updated);
    }
}