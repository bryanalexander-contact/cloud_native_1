package cl.duoc.rutaexpress.report.consumer;

import cl.duoc.rutaexpress.report.dto.ShipmentAnalyticsEventDTO;
import cl.duoc.rutaexpress.report.dto.ShipmentStatusEventDTO;
import cl.duoc.rutaexpress.report.service.ShipmentAnalyticsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@Component
public class ShipmentKafkaConsumer {

    private static final Logger log = LoggerFactory.getLogger(ShipmentKafkaConsumer.class);

    private final ShipmentAnalyticsService analyticsService;
    private final ObjectMapper objectMapper;

    public ShipmentKafkaConsumer(ShipmentAnalyticsService analyticsService, ObjectMapper objectMapper) {
        this.analyticsService = analyticsService;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "${app.kafka.topic.events:rutaexpress.shipments.events}", groupId = "${spring.kafka.consumer.group-id}")
    public void consumeStatusEvent(
            @Payload String payload,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset) {
        try {
            log.info("📥 Mensaje recibido de [rutaexpress.shipments.events] | Partición: {} | Offset: {}", partition, offset);
            ShipmentStatusEventDTO event = objectMapper.readValue(payload, ShipmentStatusEventDTO.class);
            analyticsService.processStatusEvent(event);
        } catch (Exception e) {
            log.error("⚠️ Error al deserializar o validar evento de estado: {}", e.getMessage());
            throw new RuntimeException("Fallo en procesamiento de evento de estado", e);
        }
    }

    @KafkaListener(topics = "${app.kafka.topic.analytics:rutaexpress.shipments.analytics}", groupId = "${spring.kafka.consumer.group-id}")
    public void consumeAnalyticsEvent(
            @Payload String payload,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset) {
        try {
            log.info("📥 Mensaje recibido de [rutaexpress.shipments.analytics] | Partición: {} | Offset: {}", partition, offset);
            ShipmentAnalyticsEventDTO event = objectMapper.readValue(payload, ShipmentAnalyticsEventDTO.class);
            analyticsService.processAnalyticsEvent(event);
        } catch (Exception e) {
            log.error("⚠️ Error al deserializar o validar evento analítico: {}", e.getMessage());
            throw new RuntimeException("Fallo en procesamiento de evento analítico", e);
        }
    }
}