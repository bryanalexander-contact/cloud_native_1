package cl.duoc.rutaexpress.report.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ReportGeneratorServiceTest {

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private ReportGeneratorService reportGeneratorService;

    @BeforeEach
    void setUp() {
        // Asignación manual de las propiedades @Value para la prueba
        ReflectionTestUtils.setField(reportGeneratorService, "exchangeName", "report.exchange");
        ReflectionTestUtils.setField(reportGeneratorService, "routingKey", "report.generated");
    }

    @Test
    void testGenerateReport() {
        String reportType = "PDF";
        String reportId = reportGeneratorService.generateReport(reportType);

        assertNotNull(reportId);
        verify(rabbitTemplate).convertAndSend(eq("report.exchange"), eq("report.generated"), any(Object.class));
    }
}