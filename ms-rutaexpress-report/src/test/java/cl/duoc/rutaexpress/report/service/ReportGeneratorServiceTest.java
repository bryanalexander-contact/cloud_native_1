package cl.duoc.rutaexpress.report.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ReportGeneratorServiceTest {

    @Mock
    private KafkaTemplate<String, String> kafkaTemplate;

    @InjectMocks
    private ReportGeneratorService reportGeneratorService;

    @Test
    void testGenerateReport() {
        String reportType = "PDF";
        String reportId = reportGeneratorService.generateReport(reportType);

        assertNotNull(reportId);
        verify(kafkaTemplate).send(eq("report-generation-topic"), eq(reportId), anyString());
    }
}
