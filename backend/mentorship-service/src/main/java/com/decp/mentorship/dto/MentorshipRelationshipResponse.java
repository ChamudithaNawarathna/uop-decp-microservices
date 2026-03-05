package com.decp.mentorship.dto;

import com.decp.mentorship.model.MeetingFrequency;
import com.decp.mentorship.model.PreferredChannel;
import com.decp.mentorship.model.RelationshipStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MentorshipRelationshipResponse {

    private Long id;
    private Long mentorId;
    private String mentorUserName;
    private Long menteeId;
    private String menteeUserName;
    private String goals;
    private MeetingFrequency frequency;
    private PreferredChannel preferredChannel;
    private LocalDate startDate;
    private LocalDate endDate;
    private RelationshipStatus status;
    private List<MentorshipFeedbackDTO> mentorFeedback;
    private List<MentorshipFeedbackDTO> menteeFeedback;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
