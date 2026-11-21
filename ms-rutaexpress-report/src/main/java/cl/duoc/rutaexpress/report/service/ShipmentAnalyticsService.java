package cl.duoc.rutaexpress.report.service;

import cl.duoc.rutaexpress.report.dto.ShipmentAnalyticsEventDTO;
import cl.duoc.rutaexpress.report.dto.ShipmentStatusEventDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class ShipmentAnalyticsService {

    private static final Logger log = LoggerFactory.getLogger(ShipmentAnalyticsService.class);

    private final AtomicInteger totalStatusChanges = new AtomicInteger(0);
    private final AtomicInteger totalDelivered = new AtomicInteger(0);
    private final AtomicLong totalProcessingTimeMs = new AtomicLong(0);
    private final Map<String, Integer> eventsByLocation = new ConcurrentHashMap<>();
    private final Map<Long, String> latestStatusByShipment = new ConcurrentHashMap<>();

    public void processStatusEvent(ShipmentStatusEventDTO event) {
        if (event == null || event.shipmentId() == null || event.newStatus() == null) {
            throw new IllegalArgumentException("Payload de ShipmentStatusEvent inválido o incompleto");
        }

        totalStatusChanges.incrementAndGet();
        latestStatusByShipment.put(event.shipmentId(), event.newStatus());

        log.info("✅ [Analítica] Estado actualizado en tiempo real -> Envío #{}: {} -> {} (Usuario: {})",
                event.shipmentId(), event.previousStatus(), event.newStatus(), event.user());
    }

    public void processAnalyticsEvent(ShipmentAnalyticsEventDTO event) {
        if (event == null || event.shipmentId() == null) {
            throw new IllegalArgumentException("Payload de ShipmentAnalyticsEvent inválido o incompleto");
        }

        if (event.isDelivered()) {
            totalDelivered.incrementAndGet();
        }
        totalProcessingTimeMs.addAndGet(event.processingTimeMs());

        String loc = event.location() != null ? event.location() : "Desconocida";
        eventsByLocation.merge(loc, 1, Integer::sum);

        log.info("📈 [Métricas] Métrica procesada para envío #{} en ubicación '{}'",
                event.shipmentId(), loc);
    }

    public Map<String, Object> getRealtimeSummary() {
        int count = totalStatusChanges.get();
        double avgTime = count > 0 ? (double) totalProcessingTimeMs.get() / count : 0.0;

        return Map.of(
            "totalEventosProcesados", count,
            "totalEnviosEntregados", totalDelivered.get(),
            "tiempoPromedioProcesamientoMs", avgTime,
            "eventosPorUbicacion", eventsByLocation,
            "ultimoEstadoPorEnvio", latestStatusByShipment
        );
    }
}