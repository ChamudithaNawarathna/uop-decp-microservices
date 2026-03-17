package com.decp.research.service;

import com.decp.research.model.ProjectMember;
import com.decp.research.repository.ProjectMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CollaborationService {

    private final ProjectMemberRepository projectMemberRepository;

    @Transactional
    public void addProjectMember(Long researchId, Long userId, String userName, ProjectMember.ProjectRole role) {
        ProjectMember member = ProjectMember.builder()
                .researchId(researchId)
                .userId(userId)
                .userName(userName)
                .role(role)
                .build();
        projectMemberRepository.save(member);
    }

    @Transactional
    public void deleteProjectCollaborationData(Long researchId) {
        projectMemberRepository.deleteByResearchId(researchId);
    }
}
