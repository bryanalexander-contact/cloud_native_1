package main.java.cl.duoc.rutaexpress.dto;

public record UpdateTopicConfigRequest(
    Long retentionMs,
    String cleanupPolicy,
    Integer newTotalPartitions
) {}