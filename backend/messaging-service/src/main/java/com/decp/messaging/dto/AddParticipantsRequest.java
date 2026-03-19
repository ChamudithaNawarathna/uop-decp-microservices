package com.decp.messaging.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddParticipantsRequest {
    private List<Long> participantIds;
    private List<String> participantNames;
}
