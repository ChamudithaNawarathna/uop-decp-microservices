package com.decp.mentorship.service;

import com.decp.mentorship.config.MentorshipEventPublisher;
import com.decp.mentorship.dto.MentorshipRelationshipRequest;
import com.decp.mentorship.dto.MentorshipRelationshipResponse;
import com.decp.mentorship.dto.MentorshipFeedbackDTO;
import com.decp.mentorship.model.*;
import com.decp.mentorship.repository.MentorshipFeedbackRepository;
import com.decp.mentorship.repository.MentorshipRelationshipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MentorshipRelationshipService {

    private final MentorshipRelationshipRepository relationshipRepository;
    private final MentorshipFeedbackRepository feedbackRepository;
    private final MentorshipEventPublisher eventPublisher;

    @Transactional
    public MentorshipRelationshipResponse startRelationship(MentorshipRequest request) {
        // Check no active relationship already exists
        List<MentorshipRelationship> existing = relationshipRepository.findActiveBetween(
                request.getMentorId(), request.getMenteeId());
        if (!existing.isEmpty()) {
            throw new RuntimeException("An active mentorship relationship already exists between these users");
        }

        MentorshipRelationship relationship = MentorshipRelationship.builder()
                .mentorId(request.getMentorId())
                .mentorUserName(request.getMentorUserName())
                .menteeId(request.getMenteeId())
                .menteeUserName(request.getMenteeUserName())
                .mentorshipRequestId(request.getId())
                .startDate(LocalDate.now())
                .status(RelationshipStatus.ACTIVE)
                .build();

        MentorshipRelationship saved = relationshipRepository.save(relationship);

        eventPublisher.publishRelationshipStarted(saved.getId(), saved.getMentorId(),
                saved.getMentorUserName(), saved.getMenteeId(), saved.getMenteeUserName());

        return toResponse(saved);
    }

    public List<MentorshipRelationshipResponse> getRelationships(Long userId) {
        return relationshipRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public MentorshipRelationshipResponse getRelationship(Long relationshipId, Long userId) {
        MentorshipRelationship relationship = relationshipRepository.findById(relationshipId)
                .orElseThrow(() -> new RuntimeException("Mentorship relationship not found with id: " + relationshipId));

        if (!relationship.getMentorId().equals(userId) && !relationship.getMenteeId().equals(userId)) {
            throw new RuntimeException("Only participants can view this relationship");
        }

        return toResponse(relationship);
    }

    @Transactional
    public MentorshipRelationshipResponse updateRelationship(Long relationshipId, Long userId,
                                                              MentorshipRelationshipRequest request) {
        MentorshipRelationship relationship = relationshipRepository.findById(relationshipId)
                .orElseThrow(() -> new RuntimeException("Mentorship relationship not found with id: " + relationshipId));

        if (!relationship.getMentorId().equals(userId) && !relationship.getMenteeId().equals(userId)) {
            throw new RuntimeException("Only participants can update this relationship");
        }

        if (request.getGoals() != null) {
            relationship.setGoals(request.getGoals());
        }
        if (request.getFrequency() != null) {
            relationship.setFrequency(request.getFrequency());
        }
        if (request.getPreferredChannel() != null) {
            relationship.setPreferredChannel(request.getPreferredChannel());
        }
        if (request.getStatus() != null) {
            relationship.setStatus(request.getStatus());
        }

        MentorshipRelationship saved = relationshipRepository.save(relationship);
        return toResponse(saved);
    }

    @Transactional
    public void endRelationship(Long relationshipId, Long userId) {
        MentorshipRelationship relationship = relationshipRepository.findById(relationshipId)
                .orElseThrow(() -> new RuntimeException("Mentorship relationship not found with id: " + relationshipId));

        if (!relationship.getMentorId().equals(userId) && !relationship.getMenteeId().equals(userId)) {
            throw new RuntimeException("Only participants can end this relationship");
        }

        relationship.setStatus(RelationshipStatus.COMPLETED);
        relationship.setEndDate(LocalDate.now());
        relationshipRepository.save(relationship);

        eventPublisher.publishRelationshipEnded(relationship.getId(), relationship.getMentorId(),
                relationship.getMentorUserName(), relationship.getMenteeId(), relationship.getMenteeUserName());
    }

    private MentorshipRelationshipResponse toResponse(MentorshipRelationship relationship) {
        List<MentorshipFeedback> allFeedback = feedbackRepository
                .findByRelationshipIdOrderByCreatedAtDesc(relationship.getId());

        List<MentorshipFeedbackDTO> mentorFeedback = allFeedback.stream()
                .filter(f -> f.getGivenByRole() == FeedbackRole.MENTOR)
                .map(this::toFeedbackDTO)
                .toList();

        List<MentorshipFeedbackDTO> menteeFeedback = allFeedback.stream()
                .filter(f -> f.getGivenByRole() == FeedbackRole.MENTEE)
                .map(this::toFeedbackDTO)
                .toList();

        return MentorshipRelationshipResponse.builder()
                .id(relationship.getId())
                .mentorId(relationship.getMentorId())
                .mentorUserName(relationship.getMentorUserName())
                .menteeId(relationship.getMenteeId())
                .menteeUserName(relationship.getMenteeUserName())
                .goals(relationship.getGoals())
                .frequency(relationship.getFrequency())
                .preferredChannel(relationship.getPreferredChannel())
                .startDate(relationship.getStartDate())
                .endDate(relationship.getEndDate())
                .status(relationship.getStatus())
                .mentorFeedback(mentorFeedback)
                .menteeFeedback(menteeFeedback)
                .createdAt(relationship.getCreatedAt())
                .updatedAt(relationship.getUpdatedAt())
                .build();
    }

    private MentorshipFeedbackDTO toFeedbackDTO(MentorshipFeedback feedback) {
        return MentorshipFeedbackDTO.builder()
                .id(feedback.getId())
                .relationshipId(feedback.getRelationshipId())
                .givenByUserId(feedback.getGivenByUserId())
                .givenByUserName(feedback.getGivenByUserName())
                .givenByRole(feedback.getGivenByRole())
                .rating(feedback.getRating())
                .comment(feedback.getComment())
                .createdAt(feedback.getCreatedAt())
                .build();
    }
}
