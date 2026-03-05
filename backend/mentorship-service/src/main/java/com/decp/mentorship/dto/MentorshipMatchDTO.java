package com.decp.mentorship.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MentorshipMatchDTO {

    private Long userId;
    private String userName;
    private MentorshipProfileResponse profile;
    private Double compatibilityScore;
    private List<String> commonInterests;
    private Double distanceScore;
}
