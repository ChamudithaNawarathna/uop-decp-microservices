package com.decp.mentorship.dto;

import com.decp.mentorship.model.ProposedDuration;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MentorshipRequestRequest {

    @NotNull(message = "Mentor ID is required")
    private Long mentorId;

    @Size(max = 1000, message = "Message must be at most 1000 characters")
    private String message;

    private List<String> topics;

    private ProposedDuration proposedDuration;
}
