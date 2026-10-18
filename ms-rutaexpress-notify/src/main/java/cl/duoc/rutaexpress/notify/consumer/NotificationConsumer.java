package cl.duoc.rutaexpress.notify.consumer;

import cl.duoc.rutaexpress.notify.config.RabbitMQConfig;
import cl.duoc.rutaexpress.notify.model.NotificationMessage;
import com.rabbitmq.client.Channel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
public class NotificationConsumer {

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void consumeNotification(NotificationMessage message, 
                                    Channel channel, 
                                    @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws IOException {
        try {
            log.info("📩 Recibiendo mensaje de RabbitMQ...");
            log.info("📧 Enviando Email simulado a {}: Asunto='{}' Cuerpo='{}'", 
                     message.getRecipient(), message.getSubject(), message.getBody());

            // Confirmación explícita (ACK) tras procesamiento exitoso
            channel.basicAck(tag, false);
        } catch (Exception e) {
            log.error("❌ Error al procesar la notificación: {}", e.getMessage(), e);
            // Rechazo explícito (NACK) en caso de fallo
            channel.basicNack(tag, false, false);
        }
    }
}