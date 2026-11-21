package cl.duoc.rutaexpress.report.dto;

import java.time.LocalDateTime;

public record ShipmentAnalyticsEventDTO(
    Long shipmentId,
    String currentStatus,
    String location,
    boolean isDelivered,
    long processingTimeMs,
    LocalDateTime recordedAt
) {}