package cl.duoc.rutaexpress.audit.controller;

import cl.duoc.rutaexpress.audit.model.AuditLog;
import cl.duoc.rutaexpress.audit.repository.AuditRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/audit/shipments")
public class AuditController {

    private final AuditRepository auditRepository;

    public AuditController(AuditRepository auditRepository) {
        this.auditRepository = auditRepository;
    }

    /**
     * Retorna todos los registros de auditoría de todos los envíos.
     */
    @GetMapping({"", "/", "/all"})
    public ResponseEntity<List<AuditLog>> getAllAuditLogs() {
        List<AuditLog> allLogs = auditRepository.findAll();
        return ResponseEntity.ok(allLogs);
    }

    /**
     * Retorna el historial de auditoría de un envío ordenado por timestamp descendente.
     * Consumido por el frontend en el TimelineModal.
     */
    @GetMapping("/{shipmentId}")
    public ResponseEntity<List<AuditLog>> getAuditHistory(@PathVariable Long shipmentId) {
        List<AuditLog> history = auditRepository.findByShipmentIdOrderByTimestampDesc(shipmentId);
        return ResponseEntity.ok(history);
    }
}
