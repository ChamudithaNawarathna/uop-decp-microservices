package com.decp.mentorship.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "mentorship_relationships")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MentorshipRelationship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long mentorId;

    private String mentorUserName;

    @Column(nullable = false)
    private Long menteeId;

    private String menteeUserName;

    private Long mentorshipRequestId;

    @Column(length = 2000)
    private String goals;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private MeetingFrequency frequency = MeetingFrequency.BIWEEKLY;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PreferredChannel preferredChannel = PreferredChannel.VIDEO_CALL;

    private LocalDate startDate;

    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RelationshipStatus status = RelationshipStatus.ACTIVE;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
