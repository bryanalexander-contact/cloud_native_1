package cl.duoc.rutaexpress.notify.model;

import lombok.Data;
import java.io.Serializable;

@Data
public class NotificationMessage implements Serializable {
    private String recipient;
    private String subject;
    private String body;

    public NotificationMessage() {}

    public NotificationMessage(String recipient, String subject, String body) {
        this.recipient = recipient;
        this.subject = subject;
        this.body = body;
    }
}
