package com.decp.mentorship.service;

import com.decp.mentorship.config.MentorshipEventPublisher;
import com.decp.mentorship.dto.MentorshipRequestRequest;
import com.decp.mentorship.dto.MentorshipRequestResponse;
import com.decp.mentorship.model.MentorshipProfile;
import com.decp.mentorship.model.MentorshipRequest;
import com.decp.mentorship.model.RequestStatus;
import com.decp.mentorship.repository.MentorshipProfileRepository;
import com.decp.mentorship.repository.MentorshipRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MentorshipRequestService {

    private final MentorshipRequestRepository requestRepository;
    private final MentorshipProfileRepository profileRepository;
    private final MentorshipRelationshipService relationshipService;
    private final MentorshipEventPublisher eventPublisher;

    @Transactional
    public MentorshipRequestResponse sendRequest(Long menteeId, String menteeUserName,
                                                  MentorshipRequestRequest request) {
        // Validate mentor exists
        MentorshipProfile mentorProfile = profileRepository.findByUserId(request.getMentorId())
                .orElseThrow(() -> new RuntimeException("Mentor profile not found for user: " + request.getMentorId()));

        // Check no pending request already exists
        List<MentorshipRequest> existing = requestRepository.findPendingBetween(menteeId, request.getMentorId());
        if (!existing.isEmpty()) {
            throw new RuntimeException("A pending mentorship request already exists between these users");
        }

        MentorshipRequest mentorshipRequest = MentorshipRequest.builder()
                .mentorId(request.getMentorId())
                .mentorUserName(mentorProfile.getUserName())
                .menteeId(menteeId)
                .menteeUserName(menteeUserName)
                .message(request.getMessage())
                .topics(request.getTopics() != null ? request.getTopics() : new ArrayList<>())
                .proposedDuration(request.getProposedDuration())
                .status(RequestStatus.PENDING)
                .build();

        MentorshipRequest saved = requestRepository.save(mentorshipRequest);

        eventPublisher.publishRequestCreated(saved.getId(), saved.getMentorId(),
                saved.getMentorUserName(), saved.getMenteeId(), saved.getMenteeUserName());

        return toResponse(saved);
    }

    @Transactional
    public MentorshipRequestResponse acceptRequest(Long requestId, Long userId) {
        MentorshipRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Mentorship request not found with id: " + requestId));

        if (!request.getMentorId().equals(userId)) {
            throw new RuntimeException("Only the mentor can accept this request");
        }

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Only pending requests can be accepted");
        }

        request.setStatus(RequestStatus.ACCEPTED);
        request.setRespondedAt(LocalDateTime.now());
        MentorshipRequest saved = requestRepository.save(request);

        // Create the relationship
        relationshipService.startRelationship(saved);

        eventPublisher.publishRequestAccepted(saved.getId(), saved.getMentorId(),
                saved.getMentorUserName(), saved.getMenteeId(), saved.getMenteeUserName());

        return toResponse(saved);
    }

    @Transactional
    public MentorshipRequestResponse rejectRequest(Long requestId, Long userId, String reason) {
        MentorshipRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Mentorship request not found with id: " + requestId));

        if (!request.getMentorId().equals(userId)) {
            throw new RuntimeException("Only the mentor can reject this request");
        }

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Only pending requests can be rejected");
        }

        request.setStatus(RequestStatus.REJECTED);
        request.setRejectionReason(reason);
        request.setRespondedAt(LocalDateTime.now());
        MentorshipRequest saved = requestRepository.save(request);

        eventPublisher.publishRequestRejected(saved.getId(), saved.getMentorId(),
                saved.getMentorUserName(), saved.getMenteeId(), saved.getMenteeUserName());

        return toResponse(saved);
    }

    @Transactional
    public MentorshipRequestResponse cancelRequest(Long requestId, Long userId) {
        MentorshipRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Mentorship request not found with id: " + requestId));

        if (!request.getMenteeId().equals(userId)) {
            throw new RuntimeException("Only the mentee can cancel this request");
        }

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Only pending requests can be cancelled");
        }

        request.setStatus(RequestStatus.CANCELLED);
        request.setRespondedAt(LocalDateTime.now());
        return toResponse(requestRepository.save(request));
    }

    public MentorshipRequestResponse getRequest(Long requestId, Long userId) {
        MentorshipRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Mentorship request not found with id: " + requestId));

        if (!request.getMentorId().equals(userId) && !request.getMenteeId().equals(userId)) {
            throw new RuntimeException("Only the requester or recipient can view this request");
        }

        return toResponse(request);
    }

    public List<MentorshipRequestResponse> getUserRequests(Long userId) {
        return requestRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    private MentorshipRequestResponse toResponse(MentorshipRequest request) {
        return MentorshipRequestResponse.builder()
                .id(request.getId())
                .mentorId(request.getMentorId())
                .mentorUserName(request.getMentorUserName())
                .menteeId(request.getMenteeId())
                .menteeUserName(request.getMenteeUserName())
                .message(request.getMessage())
                .topics(request.getTopics())
                .proposedDuration(request.getProposedDuration())
                .status(request.getStatus())
                .rejectionReason(request.getRejectionReason())
                .createdAt(request.getCreatedAt())
                .respondedAt(request.getRespondedAt())
                .build();
    }
}
