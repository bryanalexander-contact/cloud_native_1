package cl.duoc.rutaexpress.dto;

public record CreateTopicRequest(
    String name,
    Integer partitions,
    Short replicationFactor,
    Long retentionMs,
    String cleanupPolicy
) {}