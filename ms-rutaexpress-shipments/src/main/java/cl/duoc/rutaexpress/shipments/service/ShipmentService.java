package cl.duoc.rutaexpress.shipments.service;

import cl.duoc.rutaexpress.shipments.dto.UpdateShipmentStatusDTO;
import cl.duoc.rutaexpress.shipments.event.ShipmentStatusEvent;
import cl.duoc.rutaexpress.shipments.model.Shipment;
import cl.duoc.rutaexpress.shipments.repository.ShipmentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final String TOPIC_SHIPMENT_EVENTS = "shipment-status-topic";

    @Transactional
    public Shipment updateStatus(Long id, UpdateShipmentStatusDTO dto) {
        Shipment shipment = shipmentRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Envío no encontrado con ID: " + id));

        String previousStatus = shipment.getStatus();
        shipment.setStatus(dto.status());
        Shipment updatedShipment = shipmentRepository.save(shipment);

        // Disparar evento asíncrono a Kafka
        ShipmentStatusEvent event = new ShipmentStatusEvent(
            id,
            previousStatus,
            dto.status(),
            LocalDateTime.now()
        );
        kafkaTemplate.send(TOPIC_SHIPMENT_EVENTS, id.toString(), event);

        return updatedShipment;
    }
}