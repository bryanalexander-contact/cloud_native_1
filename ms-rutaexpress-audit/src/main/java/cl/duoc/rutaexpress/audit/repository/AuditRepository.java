package cl.duoc.rutaexpress.audit.repository;

import cl.duoc.rutaexpress.audit.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByShipmentIdOrderByTimestampDesc(Long shipmentId);
}