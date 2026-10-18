package cl.duoc.rutaexpress.notify.service;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RabbitAdminService {

    private final RabbitAdmin rabbitAdmin;

    public boolean createQueue(String queueName, boolean durable) {
        Queue queue = new Queue(queueName, durable);
        String declaredName = rabbitAdmin.declareQueue(queue);
        return declaredName != null;
    }

    public boolean deleteQueue(String queueName) {
        return rabbitAdmin.deleteQueue(queueName);
    }
}