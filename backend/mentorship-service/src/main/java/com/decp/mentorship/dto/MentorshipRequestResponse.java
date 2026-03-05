package com.decp.mentorship.dto;

import com.decp.mentorship.model.ProposedDuration;
import com.decp.mentorship.model.RequestStatus;
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
public class MentorshipRequestResponse {

    private Long id;
    private Long mentorId;
    private String mentorUserName;
    private Long menteeId;
    private String menteeUserName;
    private String message;
    private List<String> topics;
    private ProposedDuration proposedDuration;
    private RequestStatus status;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime respondedAt;
}
