package cl.duoc.rutaexpress.kafkaadmin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "cl.duoc.rutaexpress")
public class MsRutaexpressKafkaAdminApplication {
    public static void main(String[] args) {
        SpringApplication.run(MsRutaexpressKafkaAdminApplication.class, args);
    }
}