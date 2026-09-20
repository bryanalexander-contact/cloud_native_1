package cl.duoc.rutaexpress.shipments.event;

import java.time.LocalDateTime;

public record ShipmentStatusEvent(
    Long shipmentId,
    String previousStatus,
    String newStatus,
    LocalDateTime timestamp
) {}