package com.decp.mentorship.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "mentorship_feedback")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MentorshipFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long relationshipId;

    @Column(nullable = false)
    private Long givenByUserId;

    private String givenByUserName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FeedbackRole givenByRole;

    @Column(nullable = false)
    private Integer rating;

    @Column(length = 1000)
    private String comment;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
