package cl.duoc.rutaexpress.shipments.controller;

import cl.duoc.rutaexpress.shipments.dto.UpdateShipmentStatusDTO;
import cl.duoc.rutaexpress.shipments.service.ShipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/shipments")
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateShipmentStatusDTO dto) {
        
        // Asumiendo que tu ShipmentService devuelve el objeto actualizado
        var updated = shipmentService.updateStatus(id, dto);
        return ResponseEntity.ok(updated);
    }
}