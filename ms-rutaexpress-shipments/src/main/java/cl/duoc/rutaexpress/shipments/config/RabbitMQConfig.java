package cl.duoc.rutaexpress.shipments.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE_SHIPMENT = "shipment.exchange";
    public static final String QUEUE_AUDIT = "audit.shipment.queue";
    public static final String ROUTING_KEY_AUDIT = "shipment.status.changed";

    public static final String DLX_EXCHANGE = "rutaexpress.dlx";
    public static final String AUDIT_DLQ = "audit.dlq";
    public static final String AUDIT_DLQ_ROUTING_KEY = "audit.dead";

    @Bean
    public DirectExchange deadLetterExchange() {
        return new DirectExchange(DLX_EXCHANGE);
    }

    @Bean
    public Queue auditDeadLetterQueue() {
        return QueueBuilder.durable(AUDIT_DLQ).build();
    }

    @Bean
    public Binding auditDlqBinding() {
        return BindingBuilder.bind(auditDeadLetterQueue())
                .to(deadLetterExchange())
                .with(AUDIT_DLQ_ROUTING_KEY);
    }

    @Bean
    public TopicExchange shipmentExchange() {
        return new TopicExchange(EXCHANGE_SHIPMENT);
    }

    @Bean
    public Queue auditQueue() {
        return QueueBuilder.durable(QUEUE_AUDIT)
                .deadLetterExchange(DLX_EXCHANGE)
                .deadLetterRoutingKey(AUDIT_DLQ_ROUTING_KEY)
                .build();
    }

    @Bean
    public Binding auditBinding(@NonNull Queue auditQueue, @NonNull TopicExchange shipmentExchange) {
        return BindingBuilder.bind(auditQueue).to(shipmentExchange).with(ROUTING_KEY_AUDIT);
    }

    @Bean
    @NonNull
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(
            @NonNull ConnectionFactory connectionFactory,
            @NonNull MessageConverter messageConverter) {
        final RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter);
        return rabbitTemplate;
    }
}