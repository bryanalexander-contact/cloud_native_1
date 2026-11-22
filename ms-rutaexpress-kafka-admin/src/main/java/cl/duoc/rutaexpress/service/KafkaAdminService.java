package cl.duoc.rutaexpress.service;

import cl.duoc.rutaexpress.dto.CreateTopicRequest;
import cl.duoc.rutaexpress.dto.UpdateTopicConfigRequest;
import org.apache.kafka.clients.admin.*;
import org.apache.kafka.clients.consumer.OffsetAndMetadata;
import org.apache.kafka.common.TopicPartition;
import org.apache.kafka.common.config.ConfigResource;
import org.apache.kafka.common.config.TopicConfig;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class KafkaAdminService {

    private final AdminClient adminClient;

    public KafkaAdminService(AdminClient adminClient) {
        this.adminClient = adminClient;
    }

    public Map<String, Object> createTopic(CreateTopicRequest req) throws ExecutionException, InterruptedException {
        int partitions = req.partitions() != null ? req.partitions() : 3;
        short replicas = req.replicationFactor() != null ? req.replicationFactor() : (short) 3;

        NewTopic newTopic = new NewTopic(req.name(), partitions, replicas);

        Map<String, String> configs = new HashMap<>();
        if (req.retentionMs() != null) {
            configs.put(TopicConfig.RETENTION_MS_CONFIG, String.valueOf(req.retentionMs()));
        }
        if (req.cleanupPolicy() != null && !req.cleanupPolicy().isBlank()) {
            configs.put(TopicConfig.CLEANUP_POLICY_CONFIG, req.cleanupPolicy());
        }
        newTopic.configs(configs);

        adminClient.createTopics(List.of(newTopic)).all().get();

        return Map.of(
            "message", "Tópico creado correctamente",
            "topic", req.name(),
            "partitions", partitions,
            "replicationFactor", replicas,
            "configs", configs
        );
    }

    public Set<String> listTopics() throws ExecutionException, InterruptedException {
        return adminClient.listTopics().names().get();
    }

    public Map<String, Object> describeTopic(String topicName) throws ExecutionException, InterruptedException {
        TopicDescription description = adminClient.describeTopics(List.of(topicName))
                .allTopicNames().get().get(topicName);

        ConfigResource resource = new ConfigResource(ConfigResource.Type.TOPIC, topicName);
        Config config = adminClient.describeConfigs(List.of(resource)).all().get().get(resource);

        Map<String, String> activeConfigs = new HashMap<>();
        config.entries().stream()
                .filter(entry -> !entry.isDefault() || entry.name().equals("retention.ms") || entry.name().equals("cleanup.policy"))
                .forEach(entry -> activeConfigs.put(entry.name(), entry.value() != null ? entry.value() : ""));

        var partitionsInfo = description.partitions().stream()
                .map(p -> Map.<String, Object>of(
                        "partition", p.partition(),
                        "leader", p.leader() != null ? p.leader().id() : -1,
                        "replicas", p.replicas().stream().map(n -> n.id()).toList(),
                        "isr", p.isr().stream().map(n -> n.id()).toList()
                )).toList();

        return Map.of(
            "name", description.name(),
            "partitionsCount", description.partitions().size(),
            "partitions", partitionsInfo,
            "configurations", activeConfigs
        );
    }

    public Map<String, Object> updateTopic(String topicName, UpdateTopicConfigRequest req) throws ExecutionException, InterruptedException {
        ConfigResource resource = new ConfigResource(ConfigResource.Type.TOPIC, topicName);
        List<AlterConfigOp> ops = new ArrayList<>();

        if (req.retentionMs() != null) {
            ops.add(new AlterConfigOp(
                new ConfigEntry(TopicConfig.RETENTION_MS_CONFIG, String.valueOf(req.retentionMs())),
                AlterConfigOp.OpType.SET
            ));
        }
        if (req.cleanupPolicy() != null && !req.cleanupPolicy().isBlank()) {
            ops.add(new AlterConfigOp(
                new ConfigEntry(TopicConfig.CLEANUP_POLICY_CONFIG, req.cleanupPolicy()),
                AlterConfigOp.OpType.SET
            ));
        }

        if (!ops.isEmpty()) {
            adminClient.incrementalAlterConfigs(Map.of(resource, ops)).all().get();
        }

        if (req.newTotalPartitions() != null) {
            adminClient.createPartitions(Map.of(topicName, NewPartitions.increaseTo(req.newTotalPartitions()))).all().get();
        }

        return describeTopic(topicName);
    }

    public Map<String, String> deleteTopic(String topicName) throws ExecutionException, InterruptedException {
        adminClient.deleteTopics(List.of(topicName)).all().get();
        return Map.of("message", "Tópico eliminado correctamente", "topic", topicName);
    }

    public Object listConsumerGroups() throws ExecutionException, InterruptedException {
        return adminClient.listConsumerGroups().all().get().stream()
                .map(g -> Map.of(
                        "groupId", g.groupId(),
                        "state", g.state().toString()
                )).toList();
    }

    public Map<String, Object> inspectConsumerGroup(String groupId) throws ExecutionException, InterruptedException {
        ConsumerGroupDescription desc = adminClient.describeConsumerGroups(List.of(groupId))
                .all().get().get(groupId);

        Map<TopicPartition, OffsetAndMetadata> offsets = adminClient
                .listConsumerGroupOffsets(groupId).partitionsToOffsetAndMetadata().get();

        var offsetList = offsets.entrySet().stream()
                .map(e -> Map.<String, Object>of(
                        "topic", e.getKey().topic(),
                        "partition", e.getKey().partition(),
                        "committedOffset", e.getValue().offset()
                )).toList();

        return Map.of(
            "groupId", desc.groupId(),
            "state", desc.state().toString(),
            "membersCount", desc.members().size(),
            "offsets", offsetList
        );
    }
}