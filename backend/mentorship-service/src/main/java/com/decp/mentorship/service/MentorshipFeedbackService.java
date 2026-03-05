package com.decp.mentorship.service;

import com.decp.mentorship.cache.MentorshipCache;
import com.decp.mentorship.config.MentorshipEventPublisher;
import com.decp.mentorship.dto.MentorshipFeedbackDTO;
import com.decp.mentorship.dto.MentorshipFeedbackRequest;
import com.decp.mentorship.model.FeedbackRole;
import com.decp.mentorship.model.MentorshipFeedback;
import com.decp.mentorship.model.MentorshipProfile;
import com.decp.mentorship.model.MentorshipRelationship;
import com.decp.mentorship.repository.MentorshipFeedbackRepository;
import com.decp.mentorship.repository.MentorshipProfileRepository;
import com.decp.mentorship.repository.MentorshipRelationshipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MentorshipFeedbackService {

    private final MentorshipFeedbackRepository feedbackRepository;
    private final MentorshipRelationshipRepository relationshipRepository;
    private final MentorshipProfileRepository profileRepository;
    private final MentorshipEventPublisher eventPublisher;
    private final MentorshipCache mentorshipCache;

    @Transactional
    public MentorshipFeedbackDTO addFeedback(Long relationshipId, Long userId, String userName,
                                              MentorshipFeedbackRequest request) {
        MentorshipRelationship relationship = relationshipRepository.findById(relationshipId)
                .orElseThrow(() -> new RuntimeException("Mentorship relationship not found with id: " + relationshipId));

        // Determine role of feedback giver
        FeedbackRole feedbackRole;
        if (relationship.getMentorId().equals(userId)) {
            feedbackRole = FeedbackRole.MENTOR;
        } else if (relationship.getMenteeId().equals(userId)) {
            feedbackRole = FeedbackRole.MENTEE;
        } else {
            throw new RuntimeException("Only participants can provide feedback on this relationship");
        }

        MentorshipFeedback feedback = MentorshipFeedback.builder()
                .relationshipId(relationshipId)
                .givenByUserId(userId)
                .givenByUserName(userName)
                .givenByRole(feedbackRole)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        MentorshipFeedback saved = feedbackRepository.save(feedback);

        // Update mentor rating if feedback is from mentee
        if (feedbackRole == FeedbackRole.MENTEE) {
            updateMentorRating(relationship.getMentorId());
        }

        eventPublisher.publishFeedbackGiven(relationshipId, relationship.getMentorId(),
                userId, request.getRating());

        return toDTO(saved);
    }

    public List<MentorshipFeedbackDTO> getFeedback(Long relationshipId, Long userId) {
        MentorshipRelationship relationship = relationshipRepository.findById(relationshipId)
                .orElseThrow(() -> new RuntimeException("Mentorship relationship not found with id: " + relationshipId));

        if (!relationship.getMentorId().equals(userId) && !relationship.getMenteeId().equals(userId)) {
            throw new RuntimeException("Only participants can view feedback for this relationship");
        }

        return feedbackRepository.findByRelationshipIdOrderByCreatedAtDesc(relationshipId).stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public void updateMentorRating(Long mentorId) {
        Double avgRating = feedbackRepository.calculateAverageRatingForMentor(mentorId);
        Long ratingCount = feedbackRepository.countRatingsForMentor(mentorId);

        MentorshipProfile profile = profileRepository.findByUserId(mentorId)
                .orElse(null);

        if (profile != null && avgRating != null) {
            profile.setRating(Math.round(avgRating * 10.0) / 10.0);
            profile.setRatingCount(ratingCount != null ? ratingCount : 0L);
            profileRepository.save(profile);

            // Update cache
            mentorshipCache.cacheMentorRating(mentorId, profile.getRating());
        }
    }

    private MentorshipFeedbackDTO toDTO(MentorshipFeedback feedback) {
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
