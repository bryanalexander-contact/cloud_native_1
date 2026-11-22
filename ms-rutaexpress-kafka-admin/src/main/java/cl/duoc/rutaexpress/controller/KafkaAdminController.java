package cl.duoc.rutaexpress.controller;

import cl.duoc.rutaexpress.dto.CreateTopicRequest;
import cl.duoc.rutaexpress.dto.UpdateTopicConfigRequest;
import cl.duoc.rutaexpress.service.KafkaAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/kafka-admin")
public class KafkaAdminController {

    private final KafkaAdminService kafkaAdminService;

    public KafkaAdminController(KafkaAdminService kafkaAdminService) {
        this.kafkaAdminService = kafkaAdminService;
    }

    @GetMapping("/topics")
    public ResponseEntity<?> listTopics() throws Exception {
        return ResponseEntity.ok(kafkaAdminService.listTopics());
    }

    @GetMapping("/topics/{topicName}")
    public ResponseEntity<?> describeTopic(@PathVariable String topicName) throws Exception {
        return ResponseEntity.ok(kafkaAdminService.describeTopic(topicName));
    }

    @PostMapping("/topics")
    public ResponseEntity<?> createTopic(@RequestBody CreateTopicRequest request) throws Exception {
        return ResponseEntity.ok(kafkaAdminService.createTopic(request));
    }

    @PutMapping("/topics/{topicName}")
    public ResponseEntity<?> updateTopic(
            @PathVariable String topicName,
            @RequestBody UpdateTopicConfigRequest request) throws Exception {
        return ResponseEntity.ok(kafkaAdminService.updateTopic(topicName, request));
    }

    @DeleteMapping("/topics/{topicName}")
    public ResponseEntity<?> deleteTopic(@PathVariable String topicName) throws Exception {
        return ResponseEntity.ok(kafkaAdminService.deleteTopic(topicName));
    }

    @GetMapping("/consumer-groups")
    public ResponseEntity<?> listConsumerGroups() throws Exception {
        return ResponseEntity.ok(kafkaAdminService.listConsumerGroups());
    }

    @GetMapping("/consumer-groups/{groupId}")
    public ResponseEntity<?> inspectConsumerGroup(@PathVariable String groupId) throws Exception {
        return ResponseEntity.ok(kafkaAdminService.inspectConsumerGroup(groupId));
    }
}