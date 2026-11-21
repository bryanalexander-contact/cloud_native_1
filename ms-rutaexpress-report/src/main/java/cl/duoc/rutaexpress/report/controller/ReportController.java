package cl.duoc.rutaexpress.report.controller;

import cl.duoc.rutaexpress.report.service.ReportGeneratorService;
import cl.duoc.rutaexpress.report.service.ShipmentAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/report")
public class ReportController {

    private final ReportGeneratorService reportGeneratorService;
    private final ShipmentAnalyticsService shipmentAnalyticsService;

    public ReportController(
            ReportGeneratorService reportGeneratorService,
            ShipmentAnalyticsService shipmentAnalyticsService) {
        this.reportGeneratorService = reportGeneratorService;
        this.shipmentAnalyticsService = shipmentAnalyticsService;
    }

    @GetMapping
    public String getReport() {
        return "Report service is running";
    }

    @GetMapping("/analytics")
    public Object getRealtimeAnalytics() {
        return ResponseEntity.ok(shipmentAnalyticsService.getRealtimeSummary());
    }

    @PostMapping("/generate")
    public Object generateReport(@RequestParam(defaultValue = "PDF") String type) {
        String reportId = reportGeneratorService.generateReport(type);
        return ResponseEntity.ok(Map.of(
            "message", "Generación de reporte iniciada",
            "reportId", reportId,
            "type", type
        ));
    }
}