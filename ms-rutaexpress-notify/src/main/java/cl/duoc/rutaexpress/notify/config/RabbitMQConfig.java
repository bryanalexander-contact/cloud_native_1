package cl.duoc.rutaexpress.notify.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;

@Configuration
public class RabbitMQConfig {

    public static final String QUEUE_NAME = "notification-queue";
    public static final String EXCHANGE_NAME = "notification-exchange";
    public static final String ROUTING_KEY = "notify.key";

    public static final String DLX_EXCHANGE = "rutaexpress.dlx";
    public static final String NOTIFY_DLQ = "notification.dlq";
    public static final String NOTIFY_DLQ_ROUTING_KEY = "notification.dead";

    @Value("${app.rabbitmq.queue:" + QUEUE_NAME + "}")
    private String queueName;

    @Value("${app.rabbitmq.exchange:" + EXCHANGE_NAME + "}")
    private String exchangeName;

    @Value("${app.rabbitmq.routingkey:" + ROUTING_KEY + "}")
    private String routingKey;

    @Bean
    public DirectExchange deadLetterExchange() {
        return new DirectExchange(DLX_EXCHANGE);
    }

    @Bean
    public Queue notificationDeadLetterQueue() {
        return QueueBuilder.durable(NOTIFY_DLQ).build();
    }

    @Bean
    public Binding notificationDlqBinding() {
        return BindingBuilder.bind(notificationDeadLetterQueue())
                .to(deadLetterExchange())
                .with(NOTIFY_DLQ_ROUTING_KEY);
    }

    @Bean
    public Queue queue() {
        return QueueBuilder.durable(queueName)
                .deadLetterExchange(DLX_EXCHANGE)
                .deadLetterRoutingKey(NOTIFY_DLQ_ROUTING_KEY)
                .build();
    }

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(exchangeName);
    }

    @Bean
    public Binding binding(@NonNull Queue queue, @NonNull TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(routingKey);
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