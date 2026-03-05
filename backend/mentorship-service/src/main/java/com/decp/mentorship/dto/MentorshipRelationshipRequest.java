package com.decp.mentorship.dto;

import com.decp.mentorship.model.MeetingFrequency;
import com.decp.mentorship.model.PreferredChannel;
import com.decp.mentorship.model.RelationshipStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MentorshipRelationshipRequest {

    private String goals;

    private MeetingFrequency frequency;

    private PreferredChannel preferredChannel;

    private RelationshipStatus status;
}
