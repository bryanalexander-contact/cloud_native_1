package cl.duoc.rutaexpress.notify.producer;

import cl.duoc.rutaexpress.notify.config.RabbitMQConfig;
import cl.duoc.rutaexpress.notify.model.NotificationMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationProducer {

    private static final Logger log = LoggerFactory.getLogger(NotificationProducer.class);
    private final RabbitTemplate rabbitTemplate;

    public void sendNotification(NotificationMessage message) {
        log.info("📤 Enviando notificación a {}: {}", message.getRecipient(), message.getSubject());
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, RabbitMQConfig.ROUTING_KEY, message);
    }
}
