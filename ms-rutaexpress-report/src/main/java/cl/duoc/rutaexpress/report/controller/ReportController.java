package cl.duoc.rutaexpress.report.controller;

import cl.duoc.rutaexpress.report.service.ReportGeneratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/report")
@RequiredArgsConstructor
public class ReportController {

    private final ReportGeneratorService reportGeneratorService;

    @GetMapping
    public String getReport() { return "Report service is running"; }

    @PostMapping("/generate")
    public ResponseEntity<Map<String, String>> generateReport(@RequestParam(defaultValue = "PDF") String type) {
        String reportId = reportGeneratorService.generateReport(type);
        return ResponseEntity.ok(Map.of(
            "message", "Generación de reporte iniciada",
            "reportId", reportId,
            "type", type
        ));
    }
}
