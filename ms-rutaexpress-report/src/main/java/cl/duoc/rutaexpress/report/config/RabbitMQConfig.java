package cl.duoc.rutaexpress.report.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;

import java.util.Objects;

@Configuration
public class RabbitMQConfig {

    public static final String DLX_EXCHANGE = "rutaexpress.dlx";
    public static final String REPORT_DLQ = "report.dlq";
    public static final String REPORT_DLQ_ROUTING_KEY = "report.dead";

    @Value("${app.rabbitmq.queue:report.queue}")
    private String queueName;

    @Value("${app.rabbitmq.exchange:report.exchange}")
    private String exchangeName;

    @Value("${app.rabbitmq.routingkey:report.generated}")
    private String routingKey;

    @Bean
    public DirectExchange deadLetterExchange() {
        return new DirectExchange(DLX_EXCHANGE);
    }

    @Bean
    public Queue reportDeadLetterQueue() {
        return QueueBuilder.durable(REPORT_DLQ).build();
    }

    @Bean
    public Binding reportDlqBinding() {
        return BindingBuilder.bind(reportDeadLetterQueue())
                .to(deadLetterExchange())
                .with(REPORT_DLQ_ROUTING_KEY);
    }

    @Bean
    public Queue reportQueue() {
        return QueueBuilder.durable(Objects.requireNonNull(queueName))
                .deadLetterExchange(DLX_EXCHANGE)
                .deadLetterRoutingKey(REPORT_DLQ_ROUTING_KEY)
                .build();
    }

    @Bean
    public TopicExchange reportExchange() {
        return new TopicExchange(exchangeName);
    }

    @Bean
    public Binding reportBinding(@NonNull Queue reportQueue, @NonNull TopicExchange reportExchange) {
        return BindingBuilder.bind(reportQueue).to(reportExchange).with(routingKey);
    }

    @Bean
    public RabbitAdmin rabbitAdmin(@NonNull ConnectionFactory connectionFactory) {
        return new RabbitAdmin(connectionFactory);
    }

    @Bean
    @NonNull
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(
            @NonNull ConnectionFactory connectionFactory,
            @NonNull Jackson2JsonMessageConverter messageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter);
        return template;
    }
}