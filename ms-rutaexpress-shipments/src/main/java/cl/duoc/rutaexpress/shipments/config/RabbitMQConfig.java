package cl.duoc.rutaexpress.shipments.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE_SHIPMENT = "shipment.exchange";
    public static final String QUEUE_AUDIT = "audit.shipment.queue";
    public static final String ROUTING_KEY_AUDIT = "shipment.status.changed";

    @Bean
    public TopicExchange shipmentExchange() {
        return new TopicExchange(EXCHANGE_SHIPMENT);
    }

    @Bean
    public Queue auditQueue() {
        return new Queue(QUEUE_AUDIT, true);
    }

    @Bean
    public Binding auditBinding(Queue auditQueue, TopicExchange shipmentExchange) {
        return BindingBuilder.bind(auditQueue).to(shipmentExchange).with(ROUTING_KEY_AUDIT);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        final RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }
}