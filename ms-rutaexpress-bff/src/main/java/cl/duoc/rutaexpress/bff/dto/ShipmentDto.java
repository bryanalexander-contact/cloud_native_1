package cl.duoc.rutaexpress.bff.dto;

import java.time.LocalDateTime;

public class ShipmentDto {
    private String id;
    private String trackingCode;
    private String origin;
    private String destination;
    private String recipientName;
    private String status;
    private LocalDateTime createdAt;

    public ShipmentDto() {}

    public ShipmentDto(String id, String trackingCode, String origin, String destination, String recipientName, String status, LocalDateTime createdAt) {
        this.id = id;
        this.trackingCode = trackingCode;
        this.origin = origin;
        this.destination = destination;
        this.recipientName = recipientName;
        this.status = status;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTrackingCode() { return trackingCode; }
    public void setTrackingCode(String trackingCode) { this.trackingCode = trackingCode; }

    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}