package com.decp.mentorship.dto;

import com.decp.mentorship.model.FeedbackRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MentorshipFeedbackDTO {

    private Long id;
    private Long relationshipId;
    private Long givenByUserId;
    private String givenByUserName;
    private FeedbackRole givenByRole;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
