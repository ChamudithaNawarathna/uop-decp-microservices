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
@Table(name = "mentorship_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MentorshipProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String userName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MentorshipRole role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole userRole;

    private String department;

    private Integer yearsOfExperience;

    @ElementCollection
    @CollectionTable(name = "mentorship_profile_expertise", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "expertise")
    @Builder.Default
    private List<String> expertise = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "mentorship_profile_interests", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "interest")
    @Builder.Default
    private List<String> interests = new ArrayList<>();

    @Column(length = 1000)
    private String bio;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Availability availability;

    private String timezone;

    @Builder.Default
    private Boolean isVerified = false;

    @Builder.Default
    private Double rating = 0.0;

    @Builder.Default
    private Long ratingCount = 0L;

    private String linkedInUrl;

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
