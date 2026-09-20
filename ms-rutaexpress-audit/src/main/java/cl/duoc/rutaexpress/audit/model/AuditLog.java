package cl.duoc.rutaexpress.audit.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "shipment_audit")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    private String id;

    private Long shipmentId;
    private String previousStatus;
    private String newStatus;
    private String location;
    private String user;
    private LocalDateTime timestamp;
}