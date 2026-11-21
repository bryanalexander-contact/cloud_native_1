package cl.duoc.rutaexpress.bff.controller;

/**
 * NOTA: Este archivo fue refactorizado.
 * Los endpoints de shipments ahora pasan por Spring Cloud Gateway
 * y son proxeados automáticamente a ms-rutaexpress-shipments.
 *
 * Rutas configuradas en application.properties:
 *   GET  /api/v1/shipments       → ms-shipments:8085/api/v1/shipments
 *   POST /api/v1/shipments       → ms-shipments:8085/api/v1/shipments
 *   PATCH /api/v1/shipments/{id}/status → ms-shipments:8085/api/v1/shipments/{id}/status
 *
 * Ver ShipmentBffController.java para endpoint legacy /api/bff/shipments
 */
public class ShipmentController {
    // Vacío - el gateway maneja el enrutamiento a ms-shipments
}