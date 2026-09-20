package cl.duoc.rutaexpress.notify.consumer;

import cl.duoc.rutaexpress.notify.config.RabbitMQConfig;
import cl.duoc.rutaexpress.notify.model.NotificationMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationConsumer {

    private static final Logger log = LoggerFactory.getLogger(NotificationConsumer.class);

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void consumeNotification(NotificationMessage message) {
        log.info("📩 Recibiendo mensaje de RabbitMQ...");
        log.info("📧 Enviando Email simulado a {}: Asunto='{}' Cuerpo='{}'", 
                 message.getRecipient(), message.getSubject(), message.getBody());
    }
}
