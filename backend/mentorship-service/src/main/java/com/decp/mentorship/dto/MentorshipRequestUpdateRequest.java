package com.decp.mentorship.dto;

import com.decp.mentorship.model.RequestStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MentorshipRequestUpdateRequest {

    private RequestStatus status;

    private String rejectionReason;
}
