package com.decp.mentorship.config;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class MentorshipEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishRequestCreated(Long requestId, Long mentorId, String mentorUserName, Long menteeId, String menteeUserName) {
        Map<String, Object> message = Map.of(
                "requestId", requestId,
                "mentorId", mentorId,
                "mentorUserName", mentorUserName,
                "menteeId", menteeId,
                "menteeUserName", menteeUserName
        );
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "mentorship.request.created", message);
    }

    public void publishRequestAccepted(Long requestId, Long mentorId, String mentorUserName, Long menteeId, String menteeUserName) {
        Map<String, Object> message = Map.of(
                "requestId", requestId,
                "mentorId", mentorId,
                "mentorUserName", mentorUserName,
                "menteeId", menteeId,
                "menteeUserName", menteeUserName
        );
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "mentorship.request.accepted", message);
    }

    public void publishRequestRejected(Long requestId, Long mentorId, String mentorUserName, Long menteeId, String menteeUserName) {
        Map<String, Object> message = Map.of(
                "requestId", requestId,
                "mentorId", mentorId,
                "mentorUserName", mentorUserName,
                "menteeId", menteeId,
                "menteeUserName", menteeUserName
        );
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "mentorship.request.rejected", message);
    }

    public void publishRelationshipStarted(Long relationshipId, Long mentorId, String mentorUserName, Long menteeId, String menteeUserName) {
        Map<String, Object> message = Map.of(
                "relationshipId", relationshipId,
                "mentorId", mentorId,
                "mentorUserName", mentorUserName,
                "menteeId", menteeId,
                "menteeUserName", menteeUserName
        );
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "mentorship.relationship.started", message);
    }

    public void publishRelationshipEnded(Long relationshipId, Long mentorId, String mentorUserName, Long menteeId, String menteeUserName) {
        Map<String, Object> message = Map.of(
                "relationshipId", relationshipId,
                "mentorId", mentorId,
                "mentorUserName", mentorUserName,
                "menteeId", menteeId,
                "menteeUserName", menteeUserName
        );
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "mentorship.relationship.ended", message);
    }

    public void publishFeedbackGiven(Long relationshipId, Long mentorId, Long givenByUserId, Integer rating) {
        Map<String, Object> message = Map.of(
                "relationshipId", relationshipId,
                "mentorId", mentorId,
                "givenByUserId", givenByUserId,
                "rating", rating
        );
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "mentorship.feedback.given", message);
    }
}
