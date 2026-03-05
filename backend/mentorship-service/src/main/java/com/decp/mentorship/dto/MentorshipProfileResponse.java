package com.decp.mentorship.dto;

import com.decp.mentorship.model.Availability;
import com.decp.mentorship.model.MentorshipRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MentorshipProfileResponse {

    private Long id;
    private Long userId;
    private String userName;
    private MentorshipRole role;
    private String department;
    private Integer yearsOfExperience;
    private List<String> expertise;
    private List<String> interests;
    private String bio;
    private Availability availability;
    private String timezone;
    private Boolean isVerified;
    private Double rating;
    private Long ratingCount;
    private String linkedInUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
