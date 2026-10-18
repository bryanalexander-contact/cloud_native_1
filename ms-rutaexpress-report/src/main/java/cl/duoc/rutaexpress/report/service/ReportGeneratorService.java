package cl.duoc.rutaexpress.report.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class ReportGeneratorService {

    private static final Logger log = LoggerFactory.getLogger(ReportGeneratorService.class);
    private final RabbitTemplate rabbitTemplate;

    @Value("${app.rabbitmq.exchange:report.exchange}")
    private String exchangeName;

    @Value("${app.rabbitmq.routingkey:report.generated}")
    private String routingKey;

    public ReportGeneratorService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public String generateReport(String reportType) {
        String reportId = UUID.randomUUID().toString();
        log.info("📊 Solicitud de generación de reporte tipo '{}' con ID: {}", reportType, reportId);

        Map<String, String> eventData = new HashMap<>();
        eventData.put("reportId", reportId);
        eventData.put("type", reportType);
        eventData.put("status", "GENERATED");

        rabbitTemplate.convertAndSend(exchangeName, routingKey, eventData);

        log.info("📤 Evento de reporte enviado a RabbitMQ en el exchange '{}' con la clave '{}'", exchangeName, routingKey);
        return reportId;
    }
}