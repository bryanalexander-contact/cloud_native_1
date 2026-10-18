package cl.duoc.rutaexpress.shipments.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "shipments")
@Data
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tracking_code")
    private String trackingCode;

    @Column(name = "recipient_name")
    private String recipientName;

    private String destination;
    private String origin;
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Shipment() {}

    public Shipment(Long id, String trackingCode, String recipientName, String destination, String origin, String status, LocalDateTime createdAt) {
        this.id = id;
        this.trackingCode = trackingCode;
        this.recipientName = recipientName;
        this.destination = destination;
        this.origin = origin;
        this.status = status;
        this.createdAt = createdAt;
    }

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null || this.status.isBlank()) {
            this.status = "Creado";
        }
        if (this.trackingCode == null || this.trackingCode.isBlank()) {
            this.trackingCode = "RE-" + (System.currentTimeMillis() % 1000000);
        }
    }
}