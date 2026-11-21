package cl.duoc.rutaexpress.audit.repository;

import cl.duoc.rutaexpress.audit.model.KafkaAuditRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface KafkaAuditRecordRepository extends JpaRepository<KafkaAuditRecord, Long> {
    List<KafkaAuditRecord> findByShipmentIdOrderByRecordedAtDesc(Long shipmentId);
}