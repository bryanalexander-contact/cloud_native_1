package cl.duoc.rutaexpress.shipments.event;

import java.time.LocalDateTime;

public record ShipmentStatusEvent(
    Long shipmentId,
    String previousStatus,
    String newStatus,
    String location,
    String user,
    LocalDateTime timestamp
) {}