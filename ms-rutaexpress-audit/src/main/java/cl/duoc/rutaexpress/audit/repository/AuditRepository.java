package cl.duoc.rutaexpress.audit.repository;

import cl.duoc.rutaexpress.audit.model.AuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AuditRepository extends MongoRepository<AuditLog, String> {

    List<AuditLog> findByShipmentIdOrderByTimestampDesc(Long shipmentId);
}