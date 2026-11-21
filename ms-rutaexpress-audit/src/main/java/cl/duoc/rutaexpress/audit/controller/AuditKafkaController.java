package cl.duoc.rutaexpress.audit.controller;

import cl.duoc.rutaexpress.audit.model.KafkaAuditRecord;
import cl.duoc.rutaexpress.audit.service.KafkaAuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/audit/kafka")
public class AuditKafkaController {

    private final KafkaAuditService kafkaAuditService;

    public AuditKafkaController(KafkaAuditService kafkaAuditService) {
        this.kafkaAuditService = kafkaAuditService;
    }

    @GetMapping
    public ResponseEntity<List<KafkaAuditRecord>> getAllKafkaAudits() {
        return ResponseEntity.ok(kafkaAuditService.getAllRecords());
    }

    @GetMapping("/shipment/{shipmentId}")
    public ResponseEntity<List<KafkaAuditRecord>> getByShipment(@PathVariable Long shipmentId) {
        return ResponseEntity.ok(kafkaAuditService.getRecordsByShipment(shipmentId));
    }
}