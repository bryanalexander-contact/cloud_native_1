package cl.duoc.rutaexpress.audit.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${app.rabbitmq.exchange:shipment.exchange}")
    private String exchangeName;

    @Value("${app.rabbitmq.queue:shipment.audit.queue}")
    private String queueName;

    @Value("${app.rabbitmq.routingkey:shipment.status.#}")
    private String routingKey;

    @Bean
    public Queue auditQueue() {
        return new Queue(queueName, true);
    }

    @Bean
    public TopicExchange shipmentExchange() {
        return new TopicExchange(exchangeName);
    }

    @Bean
    public Binding auditBinding(Queue auditQueue, TopicExchange shipmentExchange) {
        return BindingBuilder.bind(auditQueue).to(shipmentExchange).with(routingKey);
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        return new Jackson2JsonMessageConverter(mapper);
    }
}