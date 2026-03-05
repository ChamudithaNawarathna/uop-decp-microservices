package com.decp.mentorship.dto;

import com.decp.mentorship.model.Availability;
import com.decp.mentorship.model.MentorshipRole;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MentorshipProfileRequest {

    @NotNull(message = "Role is required")
    private MentorshipRole role;

    private String department;

    private Integer yearsOfExperience;

    private List<String> expertise;

    private List<String> interests;

    @Size(max = 1000, message = "Bio must be at most 1000 characters")
    private String bio;

    @NotNull(message = "Availability is required")
    private Availability availability;

    private String timezone;

    private String linkedInUrl;
}
