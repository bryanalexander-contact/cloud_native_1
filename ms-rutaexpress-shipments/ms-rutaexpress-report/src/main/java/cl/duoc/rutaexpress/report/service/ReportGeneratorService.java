package cl.duoc.rutaexpress.report.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ReportGeneratorService {

    private static final Logger log = LoggerFactory.getLogger(ReportGeneratorService.class);
    private final KafkaTemplate<String, String> kafkaTemplate;
    private static final String TOPIC = "report-generation-topic";

    public ReportGeneratorService(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public String generateReport(String reportType) {
        String reportId = UUID.randomUUID().toString();
        log.info("📊 Solicitud de generación de reporte tipo '{}' con ID: {}", reportType, reportId);
        
        // Simular publicación en Kafka para procesamiento asíncrono (o notificar a otros microservicios que el reporte está listo)
        String message = String.format("{\"reportId\": \"%s\", \"type\": \"%s\", \"status\": \"GENERATED\"}", reportId, reportType);
        kafkaTemplate.send(TOPIC, reportId, message);
        
        log.info("📤 Evento de reporte enviado a Kafka en el tópico {}", TOPIC);
        return reportId;
    }
}
