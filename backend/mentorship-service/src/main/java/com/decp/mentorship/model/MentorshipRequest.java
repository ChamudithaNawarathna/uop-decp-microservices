package com.decp.mentorship.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "mentorship_requests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MentorshipRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long mentorId;

    private String mentorUserName;

    @Column(nullable = false)
    private Long menteeId;

    private String menteeUserName;

    @Column(length = 1000)
    private String message;

    @ElementCollection
    @CollectionTable(name = "mentorship_request_topics", joinColumns = @JoinColumn(name = "request_id"))
    @Column(name = "topic")
    @Builder.Default
    private List<String> topics = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private ProposedDuration proposedDuration;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RequestStatus status = RequestStatus.PENDING;

    private String rejectionReason;

    private LocalDateTime respondedAt;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
