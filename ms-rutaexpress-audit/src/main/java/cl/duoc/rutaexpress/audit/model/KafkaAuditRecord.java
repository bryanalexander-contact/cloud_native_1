package cl.duoc.rutaexpress.audit.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "kafka_audit_records")
public class KafkaAuditRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long shipmentId;
    private String previousStatus;
    private String newStatus;
    private String location;
    private String performedBy;
    private LocalDateTime eventTimestamp;

    private String kafkaTopic;
    private int kafkaPartition;
    private long kafkaOffset;
    private LocalDateTime recordedAt;

    public KafkaAuditRecord() {}

    public KafkaAuditRecord(Long shipmentId, String previousStatus, String newStatus, String location,
                            String performedBy, LocalDateTime eventTimestamp, String kafkaTopic,
                            int kafkaPartition, long kafkaOffset) {
        this.shipmentId = shipmentId;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.location = location;
        this.performedBy = performedBy;
        this.eventTimestamp = eventTimestamp;
        this.kafkaTopic = kafkaTopic;
        this.kafkaPartition = kafkaPartition;
        this.kafkaOffset = kafkaOffset;
        this.recordedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Long getShipmentId() { return shipmentId; }
    public String getPreviousStatus() { return previousStatus; }
    public String getNewStatus() { return newStatus; }
    public String getLocation() { return location; }
    public String getPerformedBy() { return performedBy; }
    public LocalDateTime getEventTimestamp() { return eventTimestamp; }
    public String getKafkaTopic() { return kafkaTopic; }
    public int getKafkaPartition() { return kafkaPartition; }
    public long getKafkaOffset() { return kafkaOffset; }
    public LocalDateTime getRecordedAt() { return recordedAt; }
}