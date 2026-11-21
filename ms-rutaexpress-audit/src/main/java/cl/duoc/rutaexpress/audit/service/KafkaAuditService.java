package cl.duoc.rutaexpress.audit.service;

import cl.duoc.rutaexpress.audit.model.KafkaAuditRecord;
import cl.duoc.rutaexpress.audit.repository.KafkaAuditRecordRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class KafkaAuditService {

    private static final Logger log = LoggerFactory.getLogger(KafkaAuditService.class);

    private final KafkaAuditRecordRepository repository;
    private final ObjectMapper objectMapper;

    public KafkaAuditService(KafkaAuditRecordRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    public void registerEventFromKafka(String rawJson, String topic, int partition, long offset) {
        try {
            JsonNode node = objectMapper.readTree(rawJson);

            if (!node.hasNonNull("shipmentId") || !node.hasNonNull("newStatus")) {
                throw new IllegalArgumentException("Mensaje inválido: faltan campos obligatorios (shipmentId o newStatus)");
            }

            Long shipmentId = node.get("shipmentId").asLong();
            String previousStatus = node.hasNonNull("previousStatus") ? node.get("previousStatus").asText() : "N/A";
            String newStatus = node.get("newStatus").asText();
            String location = node.hasNonNull("location") ? node.get("location").asText() : "Desconocida";
            String user = node.hasNonNull("user") ? node.get("user").asText() : "Sistema";
            LocalDateTime eventTs = node.hasNonNull("timestamp")
                    ? LocalDateTime.parse(node.get("timestamp").asText())
                    : LocalDateTime.now();

            KafkaAuditRecord record = new KafkaAuditRecord(
                    shipmentId, previousStatus, newStatus, location, user, eventTs, topic, partition, offset
            );
            repository.save(record);

            log.info("🛡️ [Auditoría Kafka] Registro guardado en BD -> Envío #{} ({} -> {}) | Partición: {}, Offset: {}",
                    shipmentId, previousStatus, newStatus, partition, offset);

        } catch (Exception e) {
            log.error("❌ [Auditoría Kafka] Error procesando mensaje en tópico {} (offset {}): {}",
                    topic, offset, e.getMessage());
            throw new RuntimeException("Error procesando evento de auditoría", e);
        }
    }

    public List<KafkaAuditRecord> getAllRecords() {
        return repository.findAll();
    }

    public List<KafkaAuditRecord> getRecordsByShipment(Long shipmentId) {
        return repository.findByShipmentIdOrderByRecordedAtDesc(shipmentId);
    }
}