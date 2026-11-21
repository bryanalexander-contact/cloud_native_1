package cl.duoc.rutaexpress.shipments.event;

import java.time.LocalDateTime;

public record ShipmentAnalyticsEvent(
    Long shipmentId,
    String currentStatus,
    String location,
    boolean isDelivered,
    long processingTimeMs,
    LocalDateTime recordedAt
) {}