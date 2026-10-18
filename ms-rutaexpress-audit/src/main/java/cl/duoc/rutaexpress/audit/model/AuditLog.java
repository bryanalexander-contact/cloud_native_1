package cl.duoc.rutaexpress.audit.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "shipment_audit")
@Data
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long shipmentId;
    private String previousStatus;
    private String newStatus;
    private String location;
    private String user;
    private LocalDateTime timestamp;

    public AuditLog() {}

    public AuditLog(Long id, Long shipmentId, String previousStatus, String newStatus, String location, String user, LocalDateTime timestamp) {
        this.id = id;
        this.shipmentId = shipmentId;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.location = location;
        this.user = user;
        this.timestamp = timestamp;
    }
}