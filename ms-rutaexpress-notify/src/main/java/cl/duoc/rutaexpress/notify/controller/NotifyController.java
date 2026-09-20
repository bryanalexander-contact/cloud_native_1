package cl.duoc.rutaexpress.notify.controller;

import cl.duoc.rutaexpress.notify.model.NotificationMessage;
import cl.duoc.rutaexpress.notify.producer.NotificationProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notify")
@RequiredArgsConstructor
public class NotifyController {

    private final NotificationProducer notificationProducer;

    @GetMapping
    public String getNotify() { return "Notify service is running"; }

    @PostMapping("/send")
    public ResponseEntity<String> sendNotification(@RequestBody NotificationMessage message) {
        notificationProducer.sendNotification(message);
        return ResponseEntity.ok("Notificación enviada a la cola de RabbitMQ exitosamente.");
    }
}
