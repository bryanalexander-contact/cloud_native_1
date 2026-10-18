package cl.duoc.rutaexpress.audit.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "shipment_audit")
@Data
public class AuditLog {

    @Id
    private String id;

    private Long shipmentId;
    private String previousStatus;
    private String newStatus;
    private String location;
    private String user;
    private LocalDateTime timestamp;

    public AuditLog() {}

    public AuditLog(String id, Long shipmentId, String previousStatus, String newStatus, String location, String user, LocalDateTime timestamp) {
        this.id = id;
        this.shipmentId = shipmentId;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.location = location;
        this.user = user;
        this.timestamp = timestamp;
    }
}