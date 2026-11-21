package cl.duoc.rutaexpress.report.dto;

import java.time.LocalDateTime;

public record ShipmentStatusEventDTO(
    Long shipmentId,
    String previousStatus,
    String newStatus,
    String location,
    String user,
    LocalDateTime timestamp
) {}