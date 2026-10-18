package cl.duoc.rutaexpress.notify.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class QueueRequestDTO {

    @NotBlank(message = "El nombre de la cola no puede estar vacío.")
    @Pattern(regexp = "^[a-zA-Z0-9._-]+$", message = "El nombre de la cola solo puede contener letras, números, guiones y puntos.")
    private String name;

    private boolean durable;

    public QueueRequestDTO() {
        this.durable = true;
    }

    public QueueRequestDTO(String name, boolean durable) {
        this.name = name;
        this.durable = durable;
    }
}