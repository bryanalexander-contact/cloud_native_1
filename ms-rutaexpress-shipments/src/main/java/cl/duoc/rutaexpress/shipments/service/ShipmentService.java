package cl.duoc.rutaexpress.shipments.service;

import cl.duoc.rutaexpress.shipments.config.RabbitMQConfig;
import cl.duoc.rutaexpress.shipments.dto.UpdateShipmentStatusDTO;
import cl.duoc.rutaexpress.shipments.event.ShipmentAnalyticsEvent;
import cl.duoc.rutaexpress.shipments.event.ShipmentStatusEvent;
import cl.duoc.rutaexpress.shipments.model.Shipment;
import cl.duoc.rutaexpress.shipments.repository.ShipmentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ShipmentService {

    private static final Logger log = LoggerFactory.getLogger(ShipmentService.class);

    private final ShipmentRepository shipmentRepository;
    private final RabbitTemplate rabbitTemplate;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${app.kafka.topic.events:rutaexpress.shipments.events}")
    private String eventsTopic;

    @Value("${app.kafka.topic.analytics:rutaexpress.shipments.analytics}")
    private String analyticsTopic;

    public ShipmentService(
            ShipmentRepository shipmentRepository,
            RabbitTemplate rabbitTemplate,
            KafkaTemplate<String, Object> kafkaTemplate) {
        this.shipmentRepository = shipmentRepository;
        this.rabbitTemplate = rabbitTemplate;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Transactional
    public Shipment updateStatus(Long id, UpdateShipmentStatusDTO dto) {
        long startTime = System.currentTimeMillis();

        Shipment shipment = shipmentRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Envío no encontrado con ID: " + id));

        String previousStatus = shipment.getStatus();
        String location = dto.location() != null ? dto.location() : "Desconocida";
        String user = dto.user() != null ? dto.user() : "Sistema";

        shipment.setStatus(dto.status());
        Shipment updatedShipment = shipmentRepository.save(shipment);

        // 1. Mantener flujo existente en RabbitMQ (mensajería transaccional)
        ShipmentStatusEvent statusEvent = new ShipmentStatusEvent(
            id,
            previousStatus,
            dto.status(),
            location,
            user,
            LocalDateTime.now()
        );

        rabbitTemplate.convertAndSend(
            RabbitMQConfig.EXCHANGE_SHIPMENT,
            RabbitMQConfig.ROUTING_KEY_AUDIT,
            statusEvent
        );

        // 2. Publicar evento de estado en Kafka (Tópico 1 - clave = id para mantener orden por envío)
        kafkaTemplate.send(eventsTopic, String.valueOf(id), statusEvent);
        log.info("📤 Evento publicado en Kafka [{}]: envioId={}, nuevoEstado={}", eventsTopic, id, dto.status());

        // 3. Publicar evento de métricas en Kafka (Tópico 2 - analítica en tiempo real)
        long elapsedMs = System.currentTimeMillis() - startTime;
        boolean delivered = "ENTREGADO".equalsIgnoreCase(dto.status()) || "DELIVERED".equalsIgnoreCase(dto.status());

        ShipmentAnalyticsEvent analyticsEvent = new ShipmentAnalyticsEvent(
            id,
            dto.status(),
            location,
            delivered,
            elapsedMs,
            LocalDateTime.now()
        );

        kafkaTemplate.send(analyticsTopic, String.valueOf(id), analyticsEvent);
        log.info("📊 Evento analítico publicado en Kafka [{}]: envioId={}", analyticsTopic, id);

        return updatedShipment;
    }
}