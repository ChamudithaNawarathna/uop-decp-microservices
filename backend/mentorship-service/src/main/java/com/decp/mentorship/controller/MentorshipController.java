package com.decp.mentorship.controller;

import com.decp.mentorship.dto.*;
import com.decp.mentorship.model.RequestStatus;
import com.decp.mentorship.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mentorship")
@RequiredArgsConstructor
public class MentorshipController {

    private final MentorshipProfileService profileService;
    private final MentorshipMatchService matchService;
    private final MentorshipRequestService requestService;
    private final MentorshipRelationshipService relationshipService;
    private final MentorshipFeedbackService feedbackService;

    // ---- Profile Endpoints ----

    @PostMapping("/profile")
    public ResponseEntity<MentorshipProfileResponse> createOrUpdateProfile(
            @RequestHeader("X-User-Name") String userName,
            @RequestHeader("X-User-Role") String userRole,
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody MentorshipProfileRequest request) {
        return ResponseEntity.ok(profileService.createOrUpdateProfile(userId, userName, userRole, request));
    }

    @GetMapping("/profile")
    public ResponseEntity<MentorshipProfileResponse> getOwnProfile(
            @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(profileService.getProfile(userId));
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<MentorshipProfileResponse> getUserProfile(
            @PathVariable Long userId) {
        return ResponseEntity.ok(profileService.getProfile(userId));
    }

    // ---- Match Endpoints ----

    @GetMapping("/matches")
    public ResponseEntity<List<MentorshipMatchDTO>> getMatches(
            @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(matchService.findMatches(userId));
    }

    @GetMapping("/matches/advanced")
    public ResponseEntity<List<MentorshipMatchDTO>> getAdvancedMatches(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(required = false) String expertise,
            @RequestParam(required = false) String availability,
            @RequestParam(required = false) String department) {
        return ResponseEntity.ok(matchService.findMatchesWithFilters(userId, expertise, availability, department));
    }

    // ---- Request Endpoints ----

    @PostMapping("/request")
    public ResponseEntity<MentorshipRequestResponse> sendRequest(
            @RequestHeader("X-User-Name") String userName,
            @RequestHeader("X-User-Role") String userRole,
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody MentorshipRequestRequest request) {
        if (!"STUDENT".equals(userRole)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(requestService.sendRequest(userId, userName, request));
    }

    @PutMapping("/request/{id}")
    public ResponseEntity<MentorshipRequestResponse> updateRequest(
            @PathVariable Long id,
            @RequestHeader("X-User-Role") String userRole,
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody MentorshipRequestUpdateRequest request) {
        if (!"ALUMNI".equals(userRole) && !"ADMIN".equals(userRole)) {
            return ResponseEntity.status(403).build();
        }
        if (request.getStatus() == RequestStatus.ACCEPTED) {
            return ResponseEntity.ok(requestService.acceptRequest(id, userId));
        } else if (request.getStatus() == RequestStatus.REJECTED) {
            return ResponseEntity.ok(requestService.rejectRequest(id, userId, request.getRejectionReason()));
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/request/{id}")
    public ResponseEntity<MentorshipRequestResponse> getRequest(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(requestService.getRequest(id, userId));
    }

    @GetMapping("/requests")
    public ResponseEntity<List<MentorshipRequestResponse>> getUserRequests(
            @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(requestService.getUserRequests(userId));
    }

    // ---- Relationship Endpoints ----

    @GetMapping("/relationships")
    public ResponseEntity<List<MentorshipRelationshipResponse>> getRelationships(
            @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(relationshipService.getRelationships(userId));
    }

    @GetMapping("/relationships/{id}")
    public ResponseEntity<MentorshipRelationshipResponse> getRelationship(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(relationshipService.getRelationship(id, userId));
    }

    @PutMapping("/relationships/{id}")
    public ResponseEntity<MentorshipRelationshipResponse> updateRelationship(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody MentorshipRelationshipRequest request) {
        return ResponseEntity.ok(relationshipService.updateRelationship(id, userId, request));
    }

    @DeleteMapping("/relationships/{id}")
    public ResponseEntity<Void> endRelationship(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        relationshipService.endRelationship(id, userId);
        return ResponseEntity.noContent().build();
    }

    // ---- Feedback Endpoints ----

    @PostMapping("/relationships/{id}/feedback")
    public ResponseEntity<MentorshipFeedbackDTO> addFeedback(
            @PathVariable Long id,
            @RequestHeader("X-User-Name") String userName,
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody MentorshipFeedbackRequest request) {
        return ResponseEntity.ok(feedbackService.addFeedback(id, userId, userName, request));
    }

    @GetMapping("/relationships/{id}/feedback")
    public ResponseEntity<List<MentorshipFeedbackDTO>> getFeedback(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(feedbackService.getFeedback(id, userId));
    }
}
