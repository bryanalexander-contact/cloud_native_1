package cl.duoc.rutaexpress.audit.consumer;

import cl.duoc.rutaexpress.audit.service.KafkaAuditService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@Component
public class AuditKafkaConsumer {

    private final KafkaAuditService kafkaAuditService;

    public AuditKafkaConsumer(KafkaAuditService kafkaAuditService) {
        this.kafkaAuditService = kafkaAuditService;
    }

    @KafkaListener(
            topics = "${app.kafka.topic.events:rutaexpress.shipments.events}",
            groupId = "${spring.kafka.consumer.group-id:ms-audit-group}"
    )
    public void onShipmentEvent(
            @Payload String payload,
            @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset) {
        kafkaAuditService.registerEventFromKafka(payload, topic, partition, offset);
    }
}