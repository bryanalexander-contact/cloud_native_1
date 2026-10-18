package cl.duoc.rutaexpress.notify.controller;

import cl.duoc.rutaexpress.notify.dto.QueueRequestDTO;
import cl.duoc.rutaexpress.notify.model.NotificationMessage;
import cl.duoc.rutaexpress.notify.producer.NotificationProducer;
import cl.duoc.rutaexpress.notify.service.RabbitAdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/notify")
public class NotifyController {

    private final NotificationProducer notificationProducer;
    private final RabbitAdminService rabbitAdminService;

    public NotifyController(NotificationProducer notificationProducer, RabbitAdminService rabbitAdminService) {
        this.notificationProducer = notificationProducer;
        this.rabbitAdminService = rabbitAdminService;
    }

    @GetMapping
    public String getNotify() { 
        return "Notify service is running"; 
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendNotification(@RequestBody NotificationMessage message) {
        notificationProducer.sendNotification(message);
        return ResponseEntity.ok("Notificación enviada a la cola de RabbitMQ exitosamente.");
    }

    @PostMapping("/queues")
    public ResponseEntity<?> createQueue(@Valid @RequestBody QueueRequestDTO request) {
        boolean created = rabbitAdminService.createQueue(request.getName(), request.isDurable());
        if (created) {
            return ResponseEntity.ok(Map.of("message", "Cola creada exitosamente: " + request.getName()));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "No se pudo crear la cola."));
    }

    @DeleteMapping("/queues/{name}")
    public ResponseEntity<?> deleteQueue(@PathVariable String name) {
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El nombre de la cola es obligatorio."));
        }
        boolean deleted = rabbitAdminService.deleteQueue(name);
        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Cola eliminada exitosamente: " + name));
        }
        return ResponseEntity.notFound().build();
    }
}